import { expect, test } from "@jest/globals";
globalThis.location = { origin: "https://repo.example" };
const { releaseOptions, renderComparison, renderTimeline, populateComparison } = (
  await import("../../../src/frontend/release/timeline.mjs")
).default();
import { state } from "../../../src/frontend/release/state.mjs";
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

test("returns no options when the catalog has no releases", () => {
  state.catalog = {};
  expect(releaseOptions()).toEqual([]);
});

test("renders an empty timeline message", () => {
  state.catalog = {};
  state.manifest = null;
  const { get } = installBrowserDom({ ids: ["release-timeline"] });
  renderTimeline();
  expect(get("release-timeline").textContent).toContain("first validated publication");
  installBrowserDom();
  renderTimeline();
});

test("shows stable, rolling, and manifest lifecycle events", () => {
  state.catalog = {
    stable: { version: "10.1", built: "2026-01-01T00:00:00Z" },
    preview: {
      items: [
        { candidate: "rolling-abcdef1234", built: "2026-01-02T00:00:00Z", validation: true },
        { candidate: "rolling-9876543", generated: "2026-01-03T00:00:00Z" },
      ],
    },
  };
  state.manifest = { generated: "2026-01-04T00:00:00Z" };
  const { get } = installBrowserDom({ ids: ["release-timeline"] });
  renderTimeline();
  expect(get("release-timeline").children).toHaveLength(4);
  expect(get("release-timeline").children[1].innerHTML).toContain("Validated");
  expect(get("release-timeline").children[2].innerHTML).toContain("Published");
  state.catalog.preview.items.push({ source: { commit: "abcdef123456" } });
  renderTimeline();
  expect(get("release-timeline").children[3].innerHTML).toContain("abcdef123456");
});

test("uses stable generated metadata when built metadata is absent", () => {
  state.catalog = { stable: { version: "10.2", generated: "2026-02-01T00:00:00Z" } };
  state.manifest = null;
  const { get } = installBrowserDom({ ids: ["release-timeline"] });
  renderTimeline();
  expect(get("release-timeline").children[0].innerHTML).toContain("Stable 10.2");
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
  installBrowserDom({ ids: ["compare-from"] });
  populateComparison();
  renderComparison();
  state.catalog = { stable: { version: "10.1" } };
  const single = installBrowserDom({ ids: ["compare-from", "compare-to"] });
  populateComparison();
  expect(single.get("compare-from").options).toHaveLength(1);
  expect(single.get("compare-to").options).toHaveLength(1);
});
