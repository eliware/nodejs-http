import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/shared/blog/reading-time.mjs";
const { readingTimeMinutes } = __moduleApi0();

test("returns at least one minute for short content", () => {
  expect(readingTimeMinutes("short article")).toBe(1);
});

test("rounds reading time up for longer content", () => {
  expect(readingTimeMinutes(Array(221).fill("word").join(" "))).toBe(2);
});
