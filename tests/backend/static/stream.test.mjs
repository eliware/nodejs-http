import { expect, jest, test } from "@jest/globals";
import { PassThrough } from "node:stream";
import path from "node:path";
import { createStaticDirectory } from "../../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../../src/backend/file-access.mjs";
const { fileExists } = __moduleApi0();
import __moduleApifix1 from "../../../src/backend/static/stream.mjs";
const { streamFile } = __moduleApifix1();

function response() {
  const output = new PassThrough();
  output.headers = {};
  output.writeHead = (status, headers) => {
    output.status = status;
    output.headers = headers;
  };
  return output;
}

async function readText(output) {
  const chunks = [];
  output.on("data", (chunk) => chunks.push(chunk));
  return new Promise((resolve) =>
    output.on("end", () => resolve(Buffer.concat(chunks).toString())),
  );
}

test("streams full, ranged, Brotli, and gzip file responses", async () => {
  const publicDir = await createStaticDirectory();
  const filePath = path.join(publicDir, "hello.txt");
  const stats = (await fileExists(filePath, { publicDir })).stats;
  const headers = () => ({ "Content-Type": "text/plain" });
  const full = response();
  const fullBody = readText(full);
  streamFile(full, filePath, stats, null, { byteRanges: true, compression: false }, headers, {
    headers: {},
  });
  expect(full.status).toBe(200);
  expect(await fullBody).toBe("hello world");

  const ranged = response();
  const rangeBody = readText(ranged);
  streamFile(ranged, filePath, stats, { start: 0, end: 4 }, { byteRanges: true }, headers, {
    headers: {},
  });
  expect(ranged.status).toBe(206);
  expect(await rangeBody).toBe("hello");

  for (const encoding of ["gzip", "br"]) {
    const compressed = response();
    const compressedBody = readText(compressed);
    streamFile(
      compressed,
      filePath,
      stats,
      null,
      { byteRanges: false, compression: true, compressionMinBytes: 0 },
      headers,
      { headers: { "accept-encoding": encoding } },
    );
    expect(compressed.headers["Content-Encoding"]).toBe(encoding);
    expect((await compressedBody).length).toBeGreaterThan(0);
  }
});

test("destroys responses when file streams fail", () => {
  const headers = () => ({ "Content-Type": "text/plain" });
  const stats = { size: 4, mtime: new Date(0), mtimeMs: 0 };
  for (const range of [{ start: 0, end: 1 }, null]) {
    const stream = new PassThrough();
    const response = new PassThrough();
    response.writeHead = jest.fn();
    const destroy = jest.spyOn(response, "destroy");
    streamFile(
      response,
      "file.txt",
      stats,
      range,
      { byteRanges: true, compression: false },
      headers,
      { headers: {} },
      () => stream,
    );
    stream.emit("error", new Error("read failed"));
    expect(destroy).toHaveBeenCalledTimes(1);
  }
});
