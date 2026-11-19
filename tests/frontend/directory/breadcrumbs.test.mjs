import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/directory/breadcrumbs.mjs";
const { renderBreadcrumbs } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

test("renders encoded directory breadcrumbs and marks the current segment", () => {
  installBrowserDom({ ids: ["directory-breadcrumbs"] });
  globalThis.HTMLAnchorElement = BrowserElement;
  renderBreadcrumbs("/el10/x86_64/");
  const crumbs = document.getElementById("directory-breadcrumbs").children;
  expect(crumbs.map((crumb) => crumb.textContent)).toEqual([
    "nodejs.eliware.org",
    "/",
    "el10",
    "/",
    "x86_64",
  ]);
  expect(crumbs[2].href).toBe("/browse?path=%2Fel10%2F");
  expect(crumbs[4].getAttribute("aria-current")).toBe("page");
});

test("renders the root breadcrumb without child segments", () => {
  installBrowserDom({ ids: ["directory-breadcrumbs"] });
  globalThis.HTMLAnchorElement = class OtherAnchor {};
  renderBreadcrumbs("/el10/");
  expect(document.getElementById("directory-breadcrumbs").children[2].href).toBeUndefined();
});
