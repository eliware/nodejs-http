import { expect, test } from "@jest/globals";
import responseApi from "../../../src/backend/response.mjs";
import errorResponseApi from "../../../src/backend/response/errors.mjs";
import { createFixtureFile } from "../../../test-fixtures/filesystem.mjs";

const { sendText } = responseApi();
const { createErrorSender } = errorResponseApi();
const sendError = createErrorSender(sendText);

function response() {
  return {
    req: { method: "GET", headers: {} },
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
  compression: false,
  securityHeaders: true,
  defaultMimeType: "application/octet-stream",
};

test("uses the text fallback when a custom file is missing or unset", async () => {
  const fallback = response();
  await sendError(fallback, 404, "missing", config, "/not/a/real/error-page.html");
  expect(fallback.body.toString()).toBe("missing");
  await sendError(fallback, 405, "unsupported", config);
  expect(fallback.statusCode).toBe(405);
  expect(fallback.body.toString()).toBe("unsupported");
});

test("uses the custom error sender when a custom file exists", async () => {
  const file = await createFixtureFile("custom error", "routed-error.html");
  const result = response();
  await sendError(result, 404, "missing", config, file);
  expect(result.headers["Content-Type"]).toContain("text/html");
  expect(result.body.toString()).toBe("custom error");
});
