import { expect, test } from "@jest/globals";
import path from "node:path";
import { createStaticDirectory } from "../../test-fixtures/filesystem.mjs";
import { createHttpResponse, readHttpBody } from "../../test-fixtures/http-response.mjs";
import __moduleApi0 from "../../src/backend/file-access.mjs";
const { fileExists } = __moduleApi0();
import __moduleApifix1 from "../../src/backend/send-file.mjs";
const { sendFile } = __moduleApifix1();

function config() {
  return {
    publicDir: "",
    allowSymlinks: false,
    byteRanges: true,
    compression: false,
    compressionMinBytes: 0,
    defaultMimeType: "application/octet-stream",
    etag: true,
    lastModified: true,
    securityHeaders: false,
  };
}

async function send(method, headers, file, settings = config()) {
  const response = createHttpResponse(method, headers);
  const body = readHttpBody(response);
  await sendFile(response, response.req, file, settings);
  return { response, body: await body };
}

test("sends full and ranged HEAD responses without bodies", async () => {
  const publicDir = await createStaticDirectory();
  const file = await fileExists(path.join(publicDir, "hello.txt"), { publicDir });

  const full = await send("HEAD", {}, file);
  expect(full.response.statusCode).toBe(200);
  expect(full.response.headers["Content-Length"]).toBe(file.stats.size);
  expect(full.body).toHaveLength(0);

  const ranged = await send("HEAD", { range: "bytes=0-4" }, file);
  expect(ranged.response.statusCode).toBe(206);
  expect(ranged.response.headers["Content-Range"]).toBe(`bytes 0-4/${file.stats.size}`);
  expect(ranged.response.headers["Content-Length"]).toBe(5);
  expect(ranged.body).toHaveLength(0);
});

test("rejects invalid ranges with a 416 response", async () => {
  const publicDir = await createStaticDirectory();
  const file = await fileExists(path.join(publicDir, "hello.txt"), { publicDir });

  const { response, body } = await send("GET", { range: "bytes=999-1000" }, file);

  expect(response.statusCode).toBe(416);
  expect(response.headers["Content-Range"]).toBe(`bytes */${file.stats.size}`);
  expect(body.toString()).toContain("Range Not Satisfiable");
});

test("compresses cached files and streams uncached file ranges", async () => {
  const publicDir = await createStaticDirectory();
  const file = await fileExists(path.join(publicDir, "hello.txt"), { publicDir });

  const compressed = await send(
    "GET",
    { "accept-encoding": "gzip" },
    { ...file, body: Buffer.from("cached response") },
    { ...config(), compression: true, compressionMinBytes: 0 },
  );
  expect(compressed.response.statusCode).toBe(200);
  expect(compressed.response.headers["Content-Encoding"]).toBe("gzip");
  expect(compressed.body.length).toBeGreaterThan(0);

  const ranged = await send("GET", { range: "bytes=0-4" }, file);
  expect(ranged.response.statusCode).toBe(206);
  expect(ranged.body.toString()).toBe("hello");
});

test("sends an uncompressed cached body when no encoding is accepted", async () => {
  const file = {
    path: "/static/file.txt",
    stats: { size: 4, mtime: new Date(0), mtimeMs: 0 },
    body: Buffer.from("data"),
  };
  const { response, body } = await send("GET", {}, file);

  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Length"]).toBe(4);
  expect(body.toString()).toBe("data");
});

test("streams full files without range support", async () => {
  const publicDir = await createStaticDirectory();
  const file = await fileExists(path.join(publicDir, "hello.txt"), { publicDir });

  const { response, body } = await send("GET", {}, file, {
    ...config(),
    byteRanges: false,
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers["Accept-Ranges"]).toBeUndefined();
  expect(body.toString()).toBe("hello world");
});
