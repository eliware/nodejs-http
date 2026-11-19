import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/source.mjs";
const { displaySource } = __moduleApi0();

test("formats source labels for preview and stable images", () => {
  expect(
    displaySource({
      channel: "rolling",
      candidate: "2026-01-01-abcdef1234",
      built: "2026-01-01T00:00:00Z",
    }),
  ).toContain("abcdef1234");
  expect(displaySource({ channel: "stable", version: "10.1", source: { ref: "release" } })).toBe(
    "release",
  );
  expect(displaySource({ channel: "stable", version: "10.1" })).toBe("Node.js 10.1");
});
