import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/guides/cache.mjs";
const { readCachedGuide } = __moduleApi0();

test("reuses cached values until guide bytes change", () => {
  const createValue = jest.fn(() => ({ title: "Guide" }));
  const first = readCachedGuide("/cache-root", "/guide.json", "first", createValue);
  expect(readCachedGuide("/cache-root", "/guide.json", "first", createValue)).toBe(first);
  const next = readCachedGuide("/cache-root", "/guide.json", "second", createValue);
  expect(next).not.toBe(first);
  expect(createValue).toHaveBeenCalledTimes(2);
});

test("keeps entries separate for different repository roots", () => {
  const first = readCachedGuide("/root-a", "/guide.json", "same", () => ({ root: "a" }));
  const second = readCachedGuide("/root-b", "/guide.json", "same", () => ({ root: "b" }));
  expect(first).not.toBe(second);
  expect(second).toEqual({ root: "b" });
});
