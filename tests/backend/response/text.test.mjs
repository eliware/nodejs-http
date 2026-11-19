import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/response/text.mjs";
const { sendText } = __moduleApi0();

function response(method = "GET", headers = {}) {
  return {
    req: { method, headers },
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

test("sends compressed text and custom headers", async () => {
  const result = response("GET", { "accept-encoding": "gzip" });
  await sendText(result, 418, "not available", { compression: true }, { "X-Test": "yes" });
  expect(result.statusCode).toBe(418);
  expect(result.headers["Content-Encoding"]).toBe("gzip");
  expect(result.headers["X-Test"]).toBe("yes");
});

test("suppresses text bodies for HEAD requests", async () => {
  const result = response("HEAD");
  await sendText(result, 200, "hidden", { compression: false });
  expect(result.headers["Content-Length"]).toBe(6);
  expect(result.body).toHaveLength(0);
});
