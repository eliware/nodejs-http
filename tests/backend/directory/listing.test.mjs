import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/listing.mjs";
const { renderDirectoryHtml, renderDirectoryRows } = __moduleApi0();

function fileStats({ directory = false, size = 1536 } = {}) {
  return {
    isDirectory: () => directory,
    size,
    mtime: new Date("2026-01-02T03:04:05.000Z"),
  };
}

test("builds escaped directory rows and file totals", () => {
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
  expect(listing.fileCount).toBe(1);
  expect(listing.totalBytes).toBe(1536);
});

test("omits a parent row at root and uses fallback listing markup", () => {
  const rows = renderDirectoryRows([], "/");
  const html = renderDirectoryHtml({
    template: null,
    requestPath: "/",
    rows: rows.html,
    fileCount: rows.fileCount,
    totalBytes: rows.totalBytes,
  });

  expect(rows.html).toBe("");
  expect(html).toContain("<!doctype html>");
  expect(html).toContain("Index of /");
  expect(html).not.toContain("Parent directory");
});

test("fills the configured listing template", () => {
  const html = renderDirectoryHtml({
    template:
      "{{TITLE}}|{{OG_IMAGE}}|{{OG_DESCRIPTION}}|{{ROWS}}|{{BREADCRUMBS}}|{{PATH}}|{{VALIDATION}}|{{SUMMARY}}|__COPYRIGHT_YEAR__|__APP_VERSION__|__HOST_ID__|__ASSET_VERSION__",
    requestPath: "/metadata/runs/run 1/",
    rows: "<tr>row</tr>",
    fileCount: 2,
    totalBytes: 1024,
    validation: null,
    containerValidation: null,
  });

  expect(html).toContain("Index of /metadata/runs/run 1/");
  expect(html).toContain("/metadata/runs/run%201/release-card.png");
  expect(html).toContain("<tr>row</tr>");
  expect(html).toContain("Total files: 2 · Total size: 1.0 KiB");
  expect(html).not.toContain("{{");
  expect(html).not.toContain("__APP_VERSION__");
  expect(html).not.toContain("__HOST_ID__");
  expect(html).toContain("15.2.0");
  expect(html).not.toContain("__ASSET_VERSION__");
});
