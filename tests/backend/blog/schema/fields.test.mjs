import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/schema/fields.mjs";
const { BLOG_SCHEMA, BLOG_STATUSES, BLOG_REQUIRED_FIELDS, BLOG_FIELDS } = __moduleApi0();

test("defines the supported blog document fields", () => {
  expect(BLOG_SCHEMA).toBe(2);
  expect(BLOG_STATUSES).toEqual(["draft", "published"]);
  expect(BLOG_REQUIRED_FIELDS).toContain("slug");
  expect(BLOG_FIELDS.has("series_order")).toBe(true);
});
