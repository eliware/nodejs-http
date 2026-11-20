import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/special-routes/pages.mjs";
const { handlePageRoutes } = __moduleApi0();
import { createHttpResponse } from "../../../test-fixtures/http-response.mjs";

test("leaves unrelated paths for the regular static file handler", async () => {
  const response = createHttpResponse("GET");
  await expect(
    handlePageRoutes(response.req, response, "/unrelated", { staticDir: "/missing" }),
  ).resolves.toBe(false);
  expect(response.statusCode).toBeNull();
});
