import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/response/custom-error.mjs";
import { createFixtureFile } from "../../../test-fixtures/filesystem.mjs";
const { sendCustomError } = __moduleApi0();

function response(method = "GET") {
  return {
    req: { method, headers: {} },
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

const config = { securityHeaders: true, defaultMimeType: "application/octet-stream" };

test("sends an existing custom error file", async () => {
  const file = await createFixtureFile("custom error", "custom-error.html");
  const result = response();
  await expect(sendCustomError(result, 404, config, file, { Allow: "GET" })).resolves.toBe(true);
  expect(result.statusCode).toBe(404);
  expect(result.headers["Content-Type"]).toContain("text/html");
  expect(result.headers.Allow).toBe("GET");
  expect(result.body.toString()).toBe("custom error");
});

test("sends custom error headers without a body for HEAD", async () => {
  const file = await createFixtureFile("custom error", "custom-head-error.html");
  const result = response("HEAD");
  await expect(sendCustomError(result, 404, config, file)).resolves.toBe(true);
  expect(result.headers["Content-Length"]).toBe(Buffer.byteLength("custom error"));
  expect(result.body).toHaveLength(0);
});

test("returns false when the custom file is missing or unset", async () => {
  expect(await sendCustomError(response(), 404, config, "/missing/error.html")).toBe(false);
  expect(await sendCustomError(response(), 404, config, "")).toBe(false);
});
