import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/schema/timestamps.mjs";
const { assertBlogTimestamps } = __moduleApi0();

const timestamps = {
  published_at: "2026-01-02T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
  created_at: "2026-01-01T00:00:00Z",
};

test("accepts valid blog timestamps in publication order", () => {
  expect(assertBlogTimestamps(timestamps, "post")).toBeUndefined();
});

test.each([
  ["empty value", { ...timestamps, published_at: "" }, /non-empty string/],
  ["invalid format", { ...timestamps, published_at: "January 2, 2026" }, /ISO-8601/],
  ["invalid date", { ...timestamps, published_at: "2026-13-40T00:00:00Z" }, /invalid/],
  [
    "creation after publication",
    { ...timestamps, created_at: "2026-01-03T00:00:00Z" },
    /cannot follow/,
  ],
  [
    "update before publication",
    { ...timestamps, updated_at: "2026-01-01T00:00:00Z" },
    /cannot precede/,
  ],
])("rejects %s", (_name, value, message) => {
  expect(() => assertBlogTimestamps(value, "post")).toThrow(message);
});
