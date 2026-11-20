import { expect, test } from "@jest/globals";
import { PassThrough } from "node:stream";
import __moduleApi0 from "../../../src/backend/directory/response.mjs";
const { sendDirectoryResponse } = __moduleApi0();

function response(method = "GET", headers = {}) {
  const value = new PassThrough();
  value.req = { method, headers };
  value.writeHead = (status, fields) => {
    value.statusCode = status;
    value.headers = fields;
  };
  return value;
}

test("sends an HTML response with security headers", async () => {
  const output = response();
  const chunks = [];
  output.on("data", (chunk) => chunks.push(chunk));
  const ended = new Promise((resolve) => output.on("end", resolve));
  await sendDirectoryResponse(output, output.req, "listing", {
    securityHeaders: true,
    compression: false,
  });
  await ended;
  expect(output.statusCode).toBe(200);
  expect(output.headers["Content-Type"]).toBe("text/html; charset=utf-8");
  expect(output.headers["X-Content-Type-Options"]).toBe("nosniff");
  expect(Buffer.concat(chunks).toString()).toBe("listing");
});

test("keeps HEAD responses empty and compresses accepted bodies", async () => {
  const head = response("HEAD");
  await sendDirectoryResponse(head, head.req, "listing", { compression: false });
  expect(head.statusCode).toBe(200);
  expect(head.headers["Content-Length"]).toBe(Buffer.byteLength("listing"));
  expect(head.read()).toBeNull();

  const compressed = response("GET", { "accept-encoding": "gzip" });
  const chunks = [];
  compressed.on("data", (chunk) => chunks.push(chunk));
  const ended = new Promise((resolve) => compressed.on("end", resolve));
  await sendDirectoryResponse(compressed, compressed.req, "listing", {
    compression: true,
    compressionMinBytes: 0,
  });
  await ended;
  expect(compressed.headers["Content-Encoding"]).toBe("gzip");
  expect(Buffer.concat(chunks).length).toBeGreaterThan(0);
});
