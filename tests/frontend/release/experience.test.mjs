import { expect, jest, test } from "@jest/globals";
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

const fetchCatalog = jest.fn();
const fetchRepositoryIndex = jest.fn();
const fetchReleaseManifest = jest.fn();
jest.unstable_mockModule("../../../src/frontend/api.mjs", () => ({
  default: () => ({
    fetchCatalog,
    fetchRepositoryIndex,
    fetchReleaseManifest,
    origin: "https://repo.example",
  }),
}));
const { initReleaseExperience } = (
  await import("../../../src/frontend/release/experience.mjs")
).default();
const { state: releaseState } = await import("../../../src/frontend/release/state.mjs");

const stable = {
  type: "file",
  name: "gluster.rpm",
  href: "/el10/10.1/gluster.rpm",
  package: { format: "rpm" },
  sha256: "abc",
  size: 2048,
  modified: "2026-01-01T00:00:00Z",
};
const rolling = {
  type: "file",
  name: "gluster.deb",
  href: "/debian/previews/2026-01-01-abcdef1234/gluster.deb",
  package: { format: "deb" },
  size: 1024,
};
function setup(search = "") {
  const copy = new BrowserElement("button");
  copy.dataset.packageDetailCopy = "package-detail-command";
  const state = installBrowserDom({
    ids: [
      "package-search",
      "package-search-results",
      "package-search-status",
      "package-detail-panel",
      "package-detail-title",
      "package-detail-meta",
      "package-detail-hash",
      "package-detail-link",
      "package-detail-command",
      "package-format",
      "package-channel",
      "release-timeline",
      "compare-from",
      "compare-to",
      "release-comparison-result",
    ],
    groups: { "[data-package-detail-copy]": [copy] },
  });
  globalThis.location = { search };
  fetchCatalog.mockResolvedValue({
    stable: { version: "10.1", built: "2026-01-01T00:00:00Z" },
    preview: { items: [{ candidate: "rolling-abcdef1234", built: "2026-01-02T00:00:00Z" }] },
  });
  fetchRepositoryIndex.mockResolvedValue({
    directories: {
      "/el10/": { path: "/el10/", entries: [stable] },
      "/debian/": { path: "/debian/", entries: [rolling] },
    },
  });
  fetchReleaseManifest.mockResolvedValue({ generated: "today" });
  return { ...state, copy };
}

test("does nothing without the package search or detail panel", async () => {
  installBrowserDom();
  await initReleaseExperience();
  expect(fetchCatalog).not.toHaveBeenCalled();
});

test("renders searchable packages, details, release history, and comparisons", async () => {
  const state = setup(`?package=${encodeURIComponent(stable.href)}`);
  await initReleaseExperience();
  expect(state.get("package-search-status").textContent).toBe("2 matching packages");
  expect(state.get("package-detail-title").textContent).toBe("gluster.rpm");
  expect(state.get("package-detail-command").textContent).toContain("dnf install");
  expect(state.get("package-detail-panel").hidden).toBe(false);
  expect(state.get("release-timeline").children.length).toBeGreaterThan(0);
  expect(state.get("compare-from").options).toHaveLength(2);
  expect(state.get("release-comparison-result").innerHTML).toContain("Packages");
  const search = state.get("package-search");
  search.value = "nothing";
  search.dispatch("input");
  expect(state.get("package-search-status").textContent).toBe("0 matching packages");
  const format = state.get("package-format");
  format.value = "deb";
  format.dispatch("change");
  const channel = state.get("package-channel");
  channel.value = "rolling";
  channel.dispatch("change");
  globalThis.navigator = { clipboard: { writeText: jest.fn(async () => {}) } };
  jest.useFakeTimers();
  state.copy.dataset.packageDetailCopy = "missing-target";
  await state.copy.dispatch("click")[0];
  state.copy.dataset.packageDetailCopy = "package-detail-command";
  await state.copy.dispatch("click")[0];
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalled();
  expect(state.copy.textContent).toBe("Copied");
  jest.advanceTimersByTime(2500);
  expect(state.copy.textContent).toBe("Copy");
  jest.useRealTimers();
});

test("loads release data without a requested package", async () => {
  const state = setup();
  releaseState.query = "";
  releaseState.format = "all";
  releaseState.channel = "all";
  state.get("package-detail-panel").hidden = true;
  await initReleaseExperience();
  expect(state.get("package-search-status").textContent).toBe("2 matching packages");
  expect(state.get("package-detail-panel").hidden).toBe(true);
});

test("reports unavailable release data", async () => {
  const state = setup();
  fetchCatalog.mockRejectedValue(new Error("offline"));
  await initReleaseExperience();
  expect(state.get("package-search-status").textContent).toBe(
    "Package metadata is temporarily unavailable.",
  );
});

test("continues when release manifest fails and skips a missing requested package", async () => {
  const state = setup("?package=%2Fmissing.rpm");
  state.get("package-detail-panel").hidden = true;
  fetchReleaseManifest.mockRejectedValue(new Error("manifest offline"));
  await initReleaseExperience();
  expect(state.get("package-search-status").textContent).toContain("matching packages");
  expect(state.get("package-detail-panel").hidden).toBe(true);
});

test("handles a missing error status element", async () => {
  installBrowserDom({ ids: ["package-detail-panel"] });
  fetchCatalog.mockRejectedValue(new Error("offline"));
  await expect(initReleaseExperience()).resolves.toBeUndefined();
});
