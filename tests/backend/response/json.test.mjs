import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/response/json.mjs";
const { sendJson } = __moduleApi0();

function response(method = "GET") {
  return {
    req: { method, headers: {} },
    headers: {},
    writeHead(statusCode, value) {
      this.statusCode = statusCode;
      this.headers = value;
    },
    end(body) {
      this.body = body === undefined ? Buffer.alloc(0) : Buffer.from(body);
    },
  };
}

test("sends JSON with its cache policy", async () => {
  const result = response();
  await sendJson(result, 200, { ok: true }, { compression: false }, "public");
  expect(result.statusCode).toBe(200);
  expect(result.headers["Content-Type"]).toBe("application/json; charset=utf-8");
  expect(result.headers["Cache-Control"]).toBe("public");
  expect(result.body.toString()).toBe('{"ok":true}\n');
});

test("suppresses JSON bodies for HEAD requests", async () => {
  const result = response("HEAD");
  await sendJson(result, 200, { ok: true }, { compression: false });
  expect(result.headers["Content-Length"]).toBe(Buffer.byteLength('{"ok":true}\n'));
  expect(result.body).toHaveLength(0);
});
