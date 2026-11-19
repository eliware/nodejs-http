import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/directory/entries.mjs";
const { formatModified, parentPath, renderEntries } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

test("normalizes parent paths", () => {
  expect(parentPath("/el10/x86_64/")).toBe("/el10");
  expect(parentPath("/")).toBe("/");
});

test("formats valid modification dates and ignores missing or invalid values", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-01-02T00:00:00Z"));
  expect(formatModified("")).toBeNull();
  expect(formatModified("invalid")).toBeNull();
  expect(formatModified("2026-01-01T00:00:00Z").relative).toContain("day");
  expect(formatModified("2026-01-01T23:00:00Z").relative).toContain("hour");
  expect(formatModified("2026-01-01T23:59:00Z").relative).toContain("minute");
  expect(formatModified("2026-01-01T23:59:59Z").relative).toContain("second");
  expect(formatModified("2026-01-03T00:00:00Z").relative).toContain("day");
  expect(formatModified("2026-01-02T01:00:00Z").relative).toContain("hour");
  expect(formatModified("2026-01-02T00:00:00.500Z").relative).toContain("second");
  jest.useRealTimers();
});

test("sorts by type, date, and name and includes non-runtime artifacts", () => {
  const { get } = installBrowserDom({ ids: ["directory-entries"] });
  const listing = {
    path: "/",
    entries: [
      { name: "b.rpm", type: "file", size: 20, modified: "2026-01-01T00:00:00Z", href: "/b" },
      { name: "a.rpm", type: "file", size: 10, modified: "2026-01-02T00:00:00Z", href: "/a" },
      { name: "folder", type: "directory", href: "/folder/" },
      { name: "another-folder", type: "directory", href: "/another-folder/" },
      { name: "debug-devel.src.rpm", type: "file", size: 5, href: "/debug" },
      { name: "zero.rpm", type: "file", size: 0, modified: "2026-01-02T00:00:00Z", href: "/zero" },
      { name: "unknown.rpm", type: "file", href: "/unknown" },
    ],
  };
  const render = (sortKey, ascending = true, runtimeOnly = false) =>
    renderEntries({ listing, sortKey, ascending, filterQuery: "", runtimeOnly });
  render("type");
  expect(
    get("directory-entries").children.map((row) => row.children?.[1]?.children?.[0]?.textContent),
  ).toContain("folder/");
  render("date", false);
  expect(
    get("directory-entries").children.map((row) => row.children?.[1]?.children?.[0]?.textContent),
  ).toContain("zero.rpm");
  render("name", false);
  expect(
    get("directory-entries").children.map((row) => row.children?.[1]?.children?.[0]?.textContent),
  ).toContain("folder/");
  render("size", true, true);
  expect(get("directory-entries").children).toHaveLength(6);
  render("date", true);
  expect(
    get("directory-entries").children.map((row) => row.children?.[1]?.children?.[0]?.textContent),
  ).toContain("debug-devel.src.rpm");
});

test("renders rows without an optional summary element", () => {
  installBrowserDom({ ids: ["directory-entries"] });
  renderEntries({
    listing: { path: "/", entries: [{ name: "folder", type: "directory", href: "/folder/" }] },
    sortKey: "name",
    ascending: true,
    filterQuery: "folder",
    runtimeOnly: false,
  });
});

test("filters, sorts, and summarizes directory entries", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-01-02T00:00:00Z"));
  const { get } = installBrowserDom({ ids: ["directory-entries", "directory-summary"] });
  globalThis.HTMLAnchorElement = BrowserElement;
  renderEntries({
    listing: {
      path: "/el10/",
      entries: [
        {
          name: "b.rpm",
          type: "file",
          size: 2048,
          href: "/el10/b.rpm",
          modified: "2026-01-01T00:00:00Z",
        },
        { name: "a-debuginfo.rpm", type: "file", size: 1024, href: "/el10/a-debuginfo.rpm" },
        { name: "x86_64", type: "directory", href: "/el10/x86_64/" },
      ],
    },
    sortKey: "size",
    ascending: false,
    filterQuery: "",
    runtimeOnly: true,
  });
  expect(get("directory-entries").children).toHaveLength(3);
  expect(get("directory-entries").children[0].innerHTML).toContain("Parent directory");
  expect(get("directory-summary").textContent).toContain("1 files");
  renderEntries({
    listing: { path: "/", entries: [] },
    sortKey: "name",
    ascending: true,
    filterQuery: "missing",
    runtimeOnly: false,
  });
  expect(get("directory-entries").children).toHaveLength(0);
  expect(get("directory-summary").textContent).toContain("0 entries");
  jest.useRealTimers();
});
