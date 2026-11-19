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

test("populates and compares release selections", () => {
  state.catalog = { stable: { version: "10.1" }, preview: { items: [{ candidate: "rolling-1" }] } };
  state.packages = [];
  const { get } = installBrowserDom({
    ids: ["compare-from", "compare-to", "release-comparison-result"],
  });
  populateComparison();
  expect(get("compare-from").options).toHaveLength(2);
  get("compare-from").value = "stable:10.1";
  get("compare-to").value = "rolling:rolling-1";
  renderComparison();
  expect(get("release-comparison-result").innerHTML).toContain("stable → rolling");
  get("compare-from").value = "bad";
  renderComparison();
  expect(get("release-comparison-result").innerHTML).toContain("stable → rolling");
  get("compare-from").value = "stable:10.1";
  get("compare-to").value = "bad";
  renderComparison();
  expect(get("release-comparison-result").innerHTML).toContain("stable → rolling");
  installBrowserDom({ ids: ["compare-from"] });
  populateComparison();
  renderComparison();
  state.catalog = { stable: { version: "10.1" } };
  const single = installBrowserDom({ ids: ["compare-from", "compare-to"] });
  populateComparison();
  expect(single.get("compare-from").options).toHaveLength(1);
  expect(single.get("compare-to").options).toHaveLength(1);
});
