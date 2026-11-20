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
    byteRanges: false,
    compression: false,
    compressionMinBytes: 0,
    defaultMimeType: "application/octet-stream",
    etag: true,
    lastModified: true,
    securityHeaders: false,
  };
}

async function send(headers, file, settings = config(), method = "GET") {
  const response = createHttpResponse(method, headers);
  const body = readHttpBody(response);
  await sendFile(response, response.req, file, settings);
  return { response, body: await body };
}

test("compresses a cached file when the client accepts gzip", async () => {
  const file = {
    path: "/static/file.txt",
    stats: { size: 4, mtime: new Date(0), mtimeMs: 0 },
    body: Buffer.from("cached response"),
  };
  const { response, body } = await send({ "accept-encoding": "gzip" }, file, {
    ...config(),
    compression: true,
    compressionMinBytes: 0,
  });
  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Encoding"]).toBe("gzip");
  expect(body.length).toBeGreaterThan(0);
});

test("sends a cached file without compression when the client does not accept it", async () => {
  const file = {
    path: "/static/file.txt",
    stats: { size: 4, mtime: new Date(0), mtimeMs: 0 },
    body: Buffer.from("data"),
  };
  const { response, body } = await send({}, file);
  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Length"]).toBe(4);
  expect(body.toString()).toBe("data");
});

test("streams full files when byte ranges are disabled", async () => {
  const publicDir = await createStaticDirectory();
  const file = await fileExists(path.join(publicDir, "hello.txt"), { publicDir });
  const { response, body } = await send({}, file, { ...config(), byteRanges: false });
  expect(response.statusCode).toBe(200);
  expect(response.headers["Accept-Ranges"]).toBeUndefined();
  expect(body.toString()).toBe("hello world");
});

test("sets compressed length for cached HEAD responses", async () => {
  const file = {
    path: "/static/file.txt",
    stats: { size: 4, mtime: new Date(0), mtimeMs: 0 },
    body: Buffer.from("cached response"),
  };
  const { response, body } = await send(
    { "accept-encoding": "gzip" },
    file,
    { ...config(), compression: true, compressionMinBytes: 0 },
    "HEAD",
  );
  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Encoding"]).toBe("gzip");
  expect(Number(response.headers["Content-Length"])).toBeGreaterThan(0);
  expect(body.length).toBe(0);
});

test("sets negotiated encoding headers for streamed HEAD responses", async () => {
  const file = {
    path: "/static/file.txt",
    stats: { size: 1024, mtime: new Date(0), mtimeMs: 0 },
  };
  const { response, body } = await send(
    { "accept-encoding": "gzip" },
    file,
    { ...config(), compression: true, compressionMinBytes: 0 },
    "HEAD",
  );
  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Encoding"]).toBe("gzip");
  expect(response.headers.Vary).toBe("Accept-Encoding");
  expect(body.length).toBe(0);
});
