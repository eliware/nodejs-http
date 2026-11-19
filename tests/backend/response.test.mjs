import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/response.mjs";
const { baseHeaders, sendError } = __moduleApi0();

test("exposes shared headers and wires text error responses", async () => {
  expect(baseHeaders({ securityHeaders: false })).toEqual({});
  const response = {
    req: { method: "GET", headers: {} },
    headers: {},
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body) {
      this.body = Buffer.from(body);
    },
  };
  await sendError(response, 404, "missing", { compression: false });
  expect(response.statusCode).toBe(404);
  expect(response.headers["Content-Type"]).toBe("text/plain; charset=utf-8");
  expect(response.body.toString()).toBe("missing");
});
