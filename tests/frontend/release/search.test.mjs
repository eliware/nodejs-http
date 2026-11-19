import { expect, test } from "@jest/globals";
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

globalThis.location = { origin: "https://repo.example" };
const { allPackages, packageMatches, releaseFor, renderDetail, renderSearch } = (
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

test("collects packages and identifies stable and rolling releases", () => {
  expect(allPackages({})).toEqual([]);
  expect(allPackages({ directories: { "/empty/": { path: "/empty/" } } })).toEqual([]);
  const stable = packageRecord("one.rpm", "rpm", "/el10/10.1/one.rpm");
  const rolling = packageRecord("two.deb", "deb", "/previews/rolling-abcdef1234/two.deb");
  expect(
    allPackages({
      directories: {
        "/el10/": {
          path: "/el10/",
          entries: [
            stable,
            rolling,
            { type: "directory", package: { format: "rpm" } },
            { type: "file" },
          ],
        },
      },
    }),
  ).toEqual([
    { ...stable, directory: "/el10/" },
    { ...rolling, directory: "/el10/" },
  ]);
  expect(releaseFor(stable)).toEqual({ channel: "stable", version: "10.1" });
  expect(releaseFor(packageRecord("old", "rpm", "/legacy/file.rpm"))).toEqual({
    channel: "stable",
    version: "stable",
  });
  expect(releaseFor(rolling)).toEqual({ channel: "rolling", version: "rolling-abcdef1234" });
  expect(releaseFor(packageRecord("rolling", "rpm", "/previews/"))).toEqual({
    channel: "rolling",
    version: "rolling",
  });
});

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

test("renders package details and supports both package managers", () => {
  installBrowserDom({
    ids: [
      "package-detail-panel",
      "package-detail-title",
      "package-detail-meta",
      "package-detail-hash",
      "package-detail-link",
      "package-detail-command",
    ],
  });
  const rpm = packageRecord("gluster.rpm", "rpm", "/el10/10.1/gluster.rpm");
  renderDetail(null);
  installBrowserDom();
  renderDetail(rpm);
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
  renderDetail(rpm);
  expect(detail.get("package-detail-title").textContent).toBe("gluster.rpm");
  expect(detail.get("package-detail-command").textContent).toContain("dnf install");
  expect(detail.get("package-detail-link").href).toBe(rpm.href);
  renderDetail({ ...rpm, package: { format: "deb" }, sha256: "", modified: "invalid" });
  expect(detail.get("package-detail-command").textContent).toContain("apt install");
  expect(detail.get("package-detail-hash").textContent).toBe("Checksum unavailable");
  expect(state.selected.package.format).toBe("deb");
  const zeroSize = { ...rpm, name: "zero.rpm", size: 0 };
  renderDetail(zeroSize);
  expect(detail.get("package-detail-meta").textContent).toContain("0 B");
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
