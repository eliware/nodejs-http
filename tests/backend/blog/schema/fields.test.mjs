import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/schema/fields.mjs";
const { BLOG_REQUIRED_FIELDS, assertBlogCoreFields } = __moduleApi0();
import __moduleApifix1 from "../../../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix1();

const document = {
  metadata_version: SUPPORTED_METADATA_VERSION,
  schema: 2,
  slug: "post",
  title: "Title",
  summary: "Summary",
  published_at: "2026-01-02T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
  author: "Eliware",
  tags: ["post"],
  status: "published",
  content: "Text",
  content_format: "markdown",
  created_at: "2026-01-01T00:00:00Z",
  category: "releases",
  last_verified_at: "2026-01-02T00:00:00Z",
  tested_on: ["Linux"],
};

test("lists required document fields and accepts valid core fields", () => {
  expect(BLOG_REQUIRED_FIELDS).toContain("slug");
  expect(assertBlogCoreFields(document, "post")).toBeUndefined();
});

test("rejects invalid core document fields", () => {
  expect(() => assertBlogCoreFields({ ...document, content_format: "html" }, "post")).toThrow(
    /content_format/,
  );
  expect(() => assertBlogCoreFields({ ...document, category: "unknown" }, "post")).toThrow(
    /category/,
  );
});
