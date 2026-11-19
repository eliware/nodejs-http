import { expect, test } from "@jest/globals";
import { state } from "../../../src/frontend/release/state.mjs";

test("starts release browsing with empty data and default filters", () => {
  expect(state).toEqual({
    catalog: {},
    index: { directories: {} },
    manifest: null,
    packages: [],
    query: "",
    format: "all",
    channel: "all",
    selected: null,
  });
});
