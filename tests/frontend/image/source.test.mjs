import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/source.mjs";
const { displaySource } = __moduleApi0();

test("formats source labels for stable images", () => {
  expect(displaySource({ channel: "stable", version: "10.1", source: { ref: "release" } })).toBe(
    "release",
  );
  expect(displaySource({ channel: "stable", version: "26.13.1" })).toBe("Node.js 26.13.1");
});
