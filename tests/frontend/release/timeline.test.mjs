import { expect, test } from "@jest/globals";
globalThis.location = { origin: "https://repo.example" };
const { renderTimeline } = (await import("../../../src/frontend/release/timeline.mjs")).default();
import { state } from "../../../src/frontend/release/state.mjs";
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

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
