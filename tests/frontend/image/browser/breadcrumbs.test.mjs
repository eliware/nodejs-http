import { expect, jest, test } from "@jest/globals";
import { installBrowserDom } from "../../../../test-fixtures/browser-dom.mjs";
import __moduleApi0 from "../../../../src/frontend/image/browser/breadcrumbs.mjs";
const { renderImageBreadcrumbs } = __moduleApi0();
import stateApi from "../../../../src/frontend/image/browser/state.mjs";
const { createImageBrowserState } = stateApi();

test("renders repository breadcrumbs and returns to the image root", () => {
  const { get } = installBrowserDom({ ids: ["image-browser-breadcrumbs"] });
  const state = createImageBrowserState({ stable: { version: "26.13.1" } }, []);
  state.openRepository = "ghcr.io/eliware/nodejs";
  const render = jest.fn();
  renderImageBreadcrumbs(state, render);
  expect(get("image-browser-breadcrumbs").children.map((item) => item.textContent)).toEqual([
    "Images",
    " / ",
    "nodejs",
  ]);
  get("image-browser-breadcrumbs").children[0].dispatch("click");
  expect(state.openRepository).toBeNull();
  expect(render).toHaveBeenCalledTimes(1);
});

test("returns when the breadcrumb container is missing", () => {
  installBrowserDom();
  expect(() => renderImageBreadcrumbs({}, jest.fn())).not.toThrow();
});
