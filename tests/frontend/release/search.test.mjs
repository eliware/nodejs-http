import { expect, test } from "@jest/globals";
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

globalThis.location = { origin: "https://repo.example" };
const { packageMatches, renderSearch } = (
  await import("../../../src/frontend/release/search.mjs")
).default();
const { state } = await import("../../../src/frontend/release/state.mjs");

function packageRecord(name, format, href) {
  return {
    type: "file",
    name,
    href,
    package: { format },
    size: 2048,
    sha256: "abc",
    modified: "2026-01-01T00:00:00Z",
  };
}

test("filters packages by name, format, and release channel", () => {
  const entry = packageRecord("gluster.rpm", "rpm", "/el10/10.1/gluster.rpm");
  state.query = "GLUSTER";
  state.format = "rpm";
  state.channel = "stable";
  expect(packageMatches(entry)).toBe(true);
  state.query = "missing";
  expect(packageMatches(entry)).toBe(false);
  state.query = "";
  state.format = "deb";
  expect(packageMatches(entry)).toBe(false);
  state.format = "all";
  state.channel = "rolling";
  expect(packageMatches(entry)).toBe(false);
  state.channel = "all";
});

test("renders search results, empty state, and the overflow note", () => {
  const { get } = installBrowserDom({ ids: ["package-search-results", "package-search-status"] });
  state.query = "";
  state.format = "all";
  state.channel = "all";
  state.packages = Array.from({ length: 13 }, (_, index) =>
    packageRecord(`pkg-${index}.rpm`, "rpm", `/el10/10.1/pkg-${index}.rpm`),
  );
  renderSearch();
  expect(get("package-search-results").children[0].children[0].innerHTML).toContain("2.0 KiB");
  expect(get("package-search-results").children).toHaveLength(13);
  expect(get("package-search-results").children.at(-1).textContent).toContain("first 12");
  get("package-search-results").children[0].children[0].dispatch("click");
  state.packages = [];
  renderSearch();
  expect(get("package-search-status").textContent).toBe("0 matching packages");
  state.packages = [packageRecord("one.rpm", "rpm", "/el10/10.1/one.rpm")];
  state.packages[0].size = 0;
  renderSearch();
  expect(get("package-search-status").textContent).toBe("1 matching package");
  installBrowserDom();
  renderSearch();
  installBrowserDom({ ids: ["package-search-results"] });
  renderSearch();
});
