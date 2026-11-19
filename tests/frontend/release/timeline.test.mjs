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

test("shows stable release lifecycle events", () => {
  state.catalog = {
    stable: {
      items: [
        {
          node_version: "26.13.1",
          built: "2026-01-01T00:00:00Z",
          validation: { status: "passed" },
        },
        { node_version: "26.13.0", generated: "2026-01-03T00:00:00Z" },
        { generated: "2026-01-05T00:00:00Z" },
      ],
    },
  };
  state.manifest = { generated: "2026-01-04T00:00:00Z" };
  const { get } = installBrowserDom({ ids: ["release-timeline"] });
  renderTimeline();
  expect(get("release-timeline").children).toHaveLength(3);
  expect(get("release-timeline").children[0].innerHTML).toContain("Validated");
  expect(get("release-timeline").children[0].innerHTML).toContain("Node.js 26.13.1");
  expect(get("release-timeline").children[2].innerHTML).toContain("Node.js stable");
});

test("uses stable generated metadata when built metadata is absent", () => {
  state.catalog = { stable: { version: "10.2", generated: "2026-02-01T00:00:00Z" } };
  state.manifest = null;
  const { get } = installBrowserDom({ ids: ["release-timeline"] });
  renderTimeline();
  expect(get("release-timeline").children[0].innerHTML).toContain("Node.js 10.2");
});

test("uses latest metadata when the stable history array is absent", () => {
  state.catalog = { stable: { latest: { node_version: "26.13.2" } } };
  const { get } = installBrowserDom({ ids: ["release-timeline"] });
  renderTimeline();
  expect(get("release-timeline").children[0].innerHTML).toContain("Node.js 26.13.2");
});
