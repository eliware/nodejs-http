import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/template.mjs";
const { renderDirectoryTemplate } = __moduleApi0();

test("replaces every configured listing token", () => {
  const template =
    "{{TITLE}}|{{OG_IMAGE}}|{{OG_DESCRIPTION}}|{{ROWS}}|{{BREADCRUMBS}}|{{PATH}}|{{VALIDATION}}|{{SUMMARY}}|__COPYRIGHT_YEAR__|__APP_VERSION__|__HOST_ID__|__ASSET_VERSION__";
  const result = renderDirectoryTemplate(template, {
    title: "Index",
    ogImage: "/image.png",
    ogDescription: "Files",
    rows: "<tr></tr>",
    breadcrumbs: "<nav></nav>",
    path: "/repo/",
    validation: "valid",
    summary: "One file",
    copyrightYear: "2026",
    appVersion: "15.2.0",
    hostId: "host-a",
    assetVersion: "15.2.0",
  });
  expect(result).toBe(
    "Index|/image.png|Files|<tr></tr>|<nav></nav>|/repo/|valid|One file|2026|15.2.0|host-a|15.2.0",
  );
});
