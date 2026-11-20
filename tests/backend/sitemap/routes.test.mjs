import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/sitemap/routes.mjs";
const { getStaticSitemapRoutes } = __moduleApi0();

test("lists the static public sitemap routes", () => {
  expect(getStaticSitemapRoutes()).toEqual(
    expect.arrayContaining(["/", "/install", "/blog", "/blog/category/releases", "/policy"]),
  );
});
