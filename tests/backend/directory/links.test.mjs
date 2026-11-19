import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/links.mjs";
const { ogImageForPath, renderBreadcrumbs } = __moduleApi0();

test("creates release card links and encoded breadcrumbs", () => {
  expect(ogImageForPath("/metadata/runs/run 1/catalog.json")).toBe(
    "/metadata/runs/run%201/release-card.png",
  );
  expect(ogImageForPath("/el10/")).toBe("/metadata/latest-release-card.png");
  expect(renderBreadcrumbs("/")).toBe('<a href="/">nodejs.eliware.org</a>');
  expect(renderBreadcrumbs("/el10/a%20b/c")).toContain("a b");
  expect(renderBreadcrumbs("/el10/a%20b/c")).toContain("/el10/a%20b/");
});
