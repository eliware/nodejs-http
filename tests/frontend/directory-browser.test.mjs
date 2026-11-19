import { expect, jest, test } from "@jest/globals";
import { BrowserElement, installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

const fetchDirectory = jest.fn();
jest.unstable_mockModule("../../src/frontend/api.mjs", () => ({
  default: () => ({ fetchDirectory }),
}));
const { initDirectoryBrowser } = (
  await import("../../src/frontend/directory-browser.mjs")
).default();

function listing() {
  return {
    path: "/el10/",
    entries: [{ name: "pkg.rpm", type: "file", size: 32, href: "/el10/pkg.rpm" }],
  };
}
function setup(search = "?path=%2Fel10%2F") {
  const firstSort = new BrowserElement("button");
  firstSort.dataset.sortKey = "type";
  const arrow = new BrowserElement("span");
  firstSort.querySelector = () => arrow;
  const header = new BrowserElement("th");
  firstSort.closest = () => header;
  const secondSort = new BrowserElement("button");
  secondSort.dataset.sortKey = "size";
  secondSort.closest = () => null;
  secondSort.querySelector = () => null;
  const state = installBrowserDom({
    ids: [
      "directory-entries",
      "directory-title",
      "directory-path",
      "directory-breadcrumbs",
      "directory-status",
      "directory-filter",
      "directory-view",
      "directory-summary",
    ],
    groups: { ".sort-button": [firstSort, secondSort] },
  });
  globalThis.HTMLAnchorElement = BrowserElement;
  globalThis.location = { pathname: "/browse", search };
  fetchDirectory.mockReset().mockResolvedValue(listing());
  return { ...state, firstSort, secondSort, arrow, header };
}

test("does nothing unless the directory table and title exist", async () => {
  installBrowserDom({ ids: ["directory-entries"] });
  await initDirectoryBrowser();
  expect(fetchDirectory).not.toHaveBeenCalled();
});

test("loads without optional path and breadcrumb elements", async () => {
  const state = installBrowserDom({
    ids: ["directory-entries", "directory-title", "directory-status"],
  });
  globalThis.location = { pathname: "/browse", search: "" };
  fetchDirectory.mockResolvedValue(listing());
  await initDirectoryBrowser();
  expect(state.get("directory-title").textContent).toBe("Index of /el10/");
});

test("adds a leading slash to a relative repository path", async () => {
  const state = setup("?path=el10%2F");
  await initDirectoryBrowser();
  expect(fetchDirectory).toHaveBeenCalledWith("/el10/");
  expect(state.get("directory-title").textContent).toBe("Index of /el10/");
});

test("loads a directory and responds to sorting, filtering, and view changes", async () => {
  const state = setup();
  await initDirectoryBrowser();
  expect(fetchDirectory).toHaveBeenCalledWith("/el10/");
  expect(state.get("directory-title").textContent).toBe("Index of /el10/");
  expect(state.get("directory-status").textContent).toBe("1 entries");
  expect(state.header.getAttribute("aria-sort")).toBe("ascending");
  state.firstSort.dispatch("click");
  expect(state.header.getAttribute("aria-sort")).toBe("descending");
  expect(state.arrow.textContent).toBe("↓");
  state.secondSort.dispatch("click");
  expect(state.secondSort.classList.contains("active")).toBe(true);
  state.get("directory-filter").value = "NO MATCH";
  state.get("directory-filter").dispatch("input");
  expect(state.get("directory-summary").textContent).toContain("Showing 0");
  state.get("directory-view").value = "runtime";
  state.get("directory-view").dispatch("change");
  expect(state.get("directory-entries").children).toHaveLength(1);
});

test("keeps a trailing slash and propagates metadata failures", async () => {
  const state = setup("?path=%2Fel10%2F");
  fetchDirectory.mockRejectedValueOnce(new Error("offline"));
  await expect(initDirectoryBrowser()).rejects.toThrow("offline");
  expect(fetchDirectory).toHaveBeenCalledWith("/el10/");
  expect(state.get("directory-entries")).toBeDefined();
});
