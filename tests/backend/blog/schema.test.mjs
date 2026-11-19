import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/blog/schema.mjs";
const schemaApi = __moduleApi0();

test("exports the complete blog schema API", () => {
  expect(schemaApi.BLOG_SCHEMA).toBe(2);
  expect(schemaApi.BLOG_STATUSES).toContain("published");
  expect(schemaApi.BLOG_REQUIRED_FIELDS).toContain("metadata_version");
  expect(schemaApi.assertBlogDocument).toBeInstanceOf(Function);
});
