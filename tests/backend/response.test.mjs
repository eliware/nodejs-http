import { expect, test } from "@jest/globals";
import { gunzipSync } from "node:zlib";
import __moduleApi0 from "../../src/backend/response.mjs";
const { baseHeaders, fileHeaders, sendError, sendJson, sendText } = __moduleApi0();
import { createFixtureFile } from "../../test-fixtures/filesystem.mjs";

function response(method = "GET", requestHeaders = {}) {
  return {
    req: { method, headers: requestHeaders },
    statusCode: null,
    headers: {},
    body: Buffer.alloc(0),
    writeHead(code, headers) {
      this.statusCode = code;
      this.headers = headers;
    },
    end(body) {
      if (body !== undefined) this.body = Buffer.from(body);
    },
  };
}

const config = {
  compression: true,
  compressionMinBytes: 1,
  securityHeaders: true,
  corsOrigin: "https://example.test",
  cacheControl: "private",
  etag: true,
  lastModified: true,
  defaultMimeType: "application/octet-stream",
};

test("builds conditional security, CORS, and cache headers", () => {
  const headers = baseHeaders(config);
  expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  expect(headers["Access-Control-Allow-Origin"]).toBe("https://example.test");
  expect(headers["Cache-Control"]).toBe("private");
  expect(baseHeaders({ securityHeaders: false })).toEqual({});
  expect(baseHeaders({ corsOrigin: "*" })).toEqual({ "Access-Control-Allow-Origin": "*" });
  expect(baseHeaders(config)["Strict-Transport-Security"]).toBeUndefined();
  expect(baseHeaders(config, { socket: { encrypted: true } })["Strict-Transport-Security"]).toBe(
    "max-age=31536000; includeSubDomains",
  );
});

test("sends text and JSON with compression, headers, and HEAD body suppression", async () => {
  const textResponse = response("GET", { "accept-encoding": "gzip" });
  await sendText(textResponse, 418, "not available", config, { "X-Test": "yes" });
  expect(textResponse.statusCode).toBe(418);
  expect(textResponse.headers["Content-Encoding"]).toBe("gzip");
  expect(gunzipSync(textResponse.body).toString()).toBe("not available");
  expect(textResponse.headers["X-Test"]).toBe("yes");
  const head = response("HEAD");
  await sendText(head, 200, "hidden", config);
  expect(head.body).toHaveLength(0);
  const json = response("GET");
  await sendJson(json, 200, { ok: true }, config, "public");
  expect(json.headers["Cache-Control"]).toBe("public");
  expect(json.body.toString()).toBe('{"ok":true}\n');
  const jsonHead = response("HEAD");
  await sendJson(jsonHead, 200, { ok: true }, config);
  expect(jsonHead.body).toHaveLength(0);
});

test("sends text and JSON when the response has no request", async () => {
  const text = response();
  delete text.req;
  await sendText(text, 200, "plain", { compression: false });
  expect(text.body.toString()).toBe("plain");
  const json = response();
  delete json.req;
  await sendJson(json, 200, { ok: true }, { compression: false });
  expect(json.body.toString()).toBe('{"ok":true}\n');
});

test("sends custom errors when present and text errors when absent", async () => {
  const file = await createFixtureFile("custom error", "error-page.html");
  const custom = response();
  await sendError(custom, 404, "missing", config, file, { Allow: "GET" });
  expect(custom.statusCode).toBe(404);
  expect(custom.headers["Content-Type"]).toContain("text/html");
  expect(custom.body.toString()).toBe("custom error");
  const fallback = response();
  await sendError(fallback, 404, "missing", config, `${file}.missing`);
  expect(fallback.body.toString()).toBe("missing");
});

test("adds MIME, Last-Modified, and ETag headers when configured", () => {
  const stats = { size: 32, mtime: new Date("2026-01-01T00:00:00Z"), mtimeMs: 10_000 };
  const headers = fileHeaders("file.json", stats, config);
  expect(headers["Content-Type"]).toContain("application/json");
  expect(headers["Last-Modified"]).toBe(stats.mtime.toUTCString());
  expect(headers.ETag).toBe('W/"20-2710"');
  expect(fileHeaders("file.unknown", stats, { defaultMimeType: "binary" })["Content-Type"]).toBe(
    "binary",
  );
});
