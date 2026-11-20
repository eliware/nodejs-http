import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/rows.mjs";
const { renderDirectoryRows } = __moduleApi0();

function fileStats({ directory = false, size = 1536 } = {}) {
  return {
    isDirectory: () => directory,
    size,
    mtime: new Date("2026-01-02T03:04:05.000Z"),
  };
}

test("builds escaped directory rows", () => {
  const listing = renderDirectoryRows(
    [
      { name: "folder & one", isDirectory: true, stats: fileStats({ directory: true }) },
      { name: "file <one>.rpm", isDirectory: false, stats: fileStats() },
      { name: "vanished.txt", isDirectory: false, stats: null },
    ],
    "/el10/",
  );

  expect(listing.html).toContain("Parent directory");
  expect(listing.html).toContain("folder &amp; one/");
  expect(listing.html).toContain("file &lt;one&gt;.rpm");
  expect(listing.html).toContain("1.5 KiB");
  expect(listing.html).toContain("2026-01-02 03:04:05 UTC");
  expect(listing.html).toContain('data-modified=""');
  expect(listing.html).toContain("vanished.txt");
});

test("omits the parent row at the root", () => {
  expect(renderDirectoryRows([], "/").html).toBe("");
});
