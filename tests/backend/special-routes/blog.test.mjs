import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/special-routes/blog.mjs";
const { handleBlogRoutes } = __moduleApi0();
import { createHttpResponse } from "../../../test-fixtures/http-response.mjs";

test("redirects the legacy blog index and ignores unrelated paths", async () => {
  const response = createHttpResponse("GET");
  await expect(
    handleBlogRoutes(response.req, response, "/blogs", { securityHeaders: false }),
  ).resolves.toBe(true);
  expect(response.statusCode).toBe(301);
  expect(response.headers.Location).toBe("/blog");
  const unrelated = createHttpResponse("GET");
  await expect(
    handleBlogRoutes(unrelated.req, unrelated, "/unrelated", { securityHeaders: false }),
  ).resolves.toBe(false);
});
