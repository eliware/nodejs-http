import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/special-routes/sitemap.mjs";
const { handleSitemapRequest } = __moduleApi0();

test("leaves non-sitemap routes for the router", async () => {
  expect(await handleSitemapRequest({}, {}, "/not-sitemap", {})).toBe(false);
});
