import { expect, test } from "@jest/globals";
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

globalThis.location = { origin: "https://repo.example" };
const { renderDetail } = (await import("../../../src/frontend/release/detail.mjs")).default();
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

test("renders package details and installation commands", () => {
  const rpm = packageRecord("gluster.rpm", "rpm", "/el10/10.1/gluster.rpm");
  const detail = installBrowserDom({
    ids: [
      "package-detail-panel",
      "package-detail-title",
      "package-detail-meta",
      "package-detail-hash",
      "package-detail-link",
      "package-detail-command",
    ],
  });
  renderDetail(null);
  renderDetail(rpm);
  expect(detail.get("package-detail-title").textContent).toBe("gluster.rpm");
  expect(detail.get("package-detail-command").textContent).toContain("dnf install");
  expect(detail.get("package-detail-link").href).toBe(rpm.href);
  renderDetail({ ...rpm, package: { format: "deb" }, sha256: "", modified: "invalid" });
  expect(detail.get("package-detail-command").textContent).toContain("apt install");
  expect(detail.get("package-detail-hash").textContent).toBe("Checksum unavailable");
  expect(state.selected.package.format).toBe("deb");
  renderDetail({ ...rpm, name: "zero.rpm", size: 0 });
  expect(detail.get("package-detail-meta").textContent).toContain("0 B");
});
