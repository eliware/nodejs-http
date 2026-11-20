import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/special-routes/api.mjs";
const { handleApiRoutes } = __moduleApi0();
import { createHttpResponse, readHttpBody } from "../../../test-fixtures/http-response.mjs";

test("handles health API requests and leaves unrelated routes unhandled", async () => {
  const response = createHttpResponse("GET");
  const body = readHttpBody(response);
  await expect(
    handleApiRoutes(response.req, response, "/health", { securityHeaders: false }),
  ).resolves.toBe(true);
  expect(JSON.parse(await body)).toEqual({ status: "ok" });
  const unrelated = createHttpResponse("GET");
  await expect(
    handleApiRoutes(unrelated.req, unrelated, "/unrelated", { securityHeaders: false }),
  ).resolves.toBe(false);
});
