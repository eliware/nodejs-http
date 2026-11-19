import { expect, test } from "@jest/globals";
globalThis.location = { origin: "https://repo.example" };
const { releaseOptions, renderComparison, populateComparison } = (
  await import("../../../src/frontend/release/comparison.mjs")
).default();
import { state } from "../../../src/frontend/release/state.mjs";
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

test("returns no options when the catalog has no releases", () => {
  state.catalog = {};
  expect(releaseOptions()).toEqual([]);
});

test("reads the latest stable release when history is absent", () => {
  state.catalog = { stable: { latest: { node_version: "26.13.1" } } };
  expect(releaseOptions()).toEqual([
    {
      id: "stable:26.13.1",
      label: "Stable 26.13.1",
      version: "26.13.1",
      channel: "stable",
    },
  ]);
  state.catalog = { stable: { items: [{}] } };
  expect(releaseOptions()).toEqual([]);
});

test("populates and compares stable releases", () => {
  state.catalog = { stable: { items: [{ node_version: "26.13.1" }, { node_version: "26.13.0" }] } };
  state.packages = [];
  const { get } = installBrowserDom({
    ids: ["compare-from", "compare-to", "release-comparison-result"],
  });
  populateComparison();
  expect(get("compare-from").options).toHaveLength(2);
  get("compare-from").value = "stable:10.1";
  get("compare-to").value = "stable:26.13.0";
  renderComparison();
  expect(get("release-comparison-result").innerHTML).toContain("stable → stable");
  get("compare-from").value = "bad";
  renderComparison();
  expect(get("release-comparison-result").innerHTML).toContain("stable → stable");
  get("compare-from").value = "stable:10.1";
  get("compare-to").value = "bad";
  renderComparison();
  expect(get("release-comparison-result").innerHTML).toContain("stable → stable");
  installBrowserDom({ ids: ["compare-from"] });
  populateComparison();
  renderComparison();
  installBrowserDom();
  renderComparison();
  state.catalog = { stable: { version: "10.1" } };
  const single = installBrowserDom({ ids: ["compare-from", "compare-to"] });
  populateComparison();
  expect(single.get("compare-from").options).toHaveLength(1);
  expect(single.get("compare-to").options).toHaveLength(1);
});
