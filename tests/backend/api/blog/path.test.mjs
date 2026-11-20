import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/api/blog/path.mjs";
const { isValidBlogSlug, matchBlogApiPath } = __moduleApi0();

test("matches collection and article routes", () => {
  expect(matchBlogApiPath("/api/v1/blogs")).toEqual({ type: "collection" });
  expect(matchBlogApiPath("/api/v1/blogs/safe-post")).toEqual({
    type: "article",
    slug: "safe-post",
  });
  expect(matchBlogApiPath("/api/v1/blogs-extra")).toBeNull();
});

test("rejects empty and nested article slugs", () => {
  expect(isValidBlogSlug("")).toBe(false);
  expect(isValidBlogSlug("safe/post")).toBe(false);
  expect(isValidBlogSlug("safe-post")).toBe(true);
});
