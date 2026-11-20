import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/page.mjs";
const { renderDirectoryHtml } = __moduleApi0();

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
    metadata: {
      appVersion: "15.2.2",
      assetVersion: "15.2.2",
      copyrightYear: "2026",
      hostId: "test-host",
    },
  });
  expect(html).toContain("Index of /metadata/runs/run 1/");
  expect(html).toContain("/metadata/runs/run%201/release-card.png");
  expect(html).toContain("<tr>row</tr>");
  expect(html).toContain("Total files: 2 · Total size: 1.0 KiB");
  expect(html).not.toContain("{{");
  expect(html).not.toContain("__APP_VERSION__");
  expect(html).not.toContain("__HOST_ID__");
  expect(html).toContain("15.2.2");
  expect(html).not.toContain("__ASSET_VERSION__");
});
