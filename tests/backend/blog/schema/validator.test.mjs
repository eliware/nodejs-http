import __moduleApi0 from "../../../../src/backend/blog/schema/validator.mjs";
const { assertBlogDocument } = __moduleApi0();
import __moduleApifix1 from "../../../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix1();

const validBlog = {
  metadata_version: SUPPORTED_METADATA_VERSION,
  schema: 2,
  slug: "rolling-releases",
  title: "Following rolling releases",
  summary: "How to follow GlusterFS rolling builds.",
  published_at: "2026-08-18T12:00:00Z",
  updated_at: "2026-08-18T12:00:00Z",
  author: "Eliware",
  tags: ["releases", "rolling"],
  status: "published",
  content: "# Rolling releases\n\nContent.",
  content_format: "markdown",
  created_at: "2026-08-18T11:00:00Z",
  category: "releases",
  last_verified_at: "2026-08-18T12:00:00Z",
  tested_on: ["Debian 12"],
};

test("accepts the canonical blog document shape", () => {
  expect(assertBlogDocument(validBlog)).toEqual(validBlog);
});

test("accepts documented optional editorial fields", () => {
  expect(
    assertBlogDocument({
      ...validBlog,
      hero_image: "/assets/blog/guide.png",
      related_slugs: ["other-post"],
      series: "Getting started",
      series_order: 1,
    }),
  ).toMatchObject({ series: "Getting started", series_order: 1 });
});

test("rejects missing metadata version and legacy metadata names", () => {
  const missing = { ...validBlog };
  delete missing.metadata_version;
  expect(() => assertBlogDocument(missing)).toThrow(/metadata version/);

  expect(() => assertBlogDocument({ ...validBlog, meta_version: "0.1.0" })).toThrow(
    /legacy meta_version/,
  );
});

test("rejects unsupported fields and schemas", () => {
  expect(() => assertBlogDocument({ ...validBlog, schema: 1 })).toThrow(/schema 1/);
  expect(() => assertBlogDocument({ ...validBlog, internal_note: "secret" })).toThrow(
    /unsupported field/,
  );
});

test("rejects invalid publication metadata", () => {
  expect(() => assertBlogDocument({ ...validBlog, slug: "Not A Slug" })).toThrow(/slug/);
  expect(() => assertBlogDocument({ ...validBlog, updated_at: "2026-08-17T12:00:00Z" })).toThrow(
    /updated_at/,
  );
});

test("rejects a missing required field", () => {
  const missing = { ...validBlog };
  delete missing.title;
  expect(() => assertBlogDocument(missing)).toThrow(/missing required field: title/);
});

test.each([
  [{ title: null }, /missing required field/],
  [{ title: "" }, /missing required field/],
  [{ title: "   " }, /title must be a non-empty string/],
  [{ summary: "   " }, /summary must be a non-empty string/],
  [{ published_at: "today" }, /ISO-8601/],
  [{ published_at: "2026-99-99T12:00:00Z" }, /published_at is invalid/],
  [{ created_at: "2026-08-19T12:00:00Z" }, /created_at cannot follow/],
  [{ updated_at: "2026-08-17T12:00:00Z" }, /updated_at cannot precede/],
  [{ author: " " }, /author must be a non-empty string/],
  [{ content_format: "html" }, /content_format/],
  [{ category: "unknown" }, /category/],
  [{ last_verified_at: "bad" }, /last_verified_at/],
  [{ tested_on: [] }, /tested_on/],
  [{ tested_on: ["Debian", " "] }, /tested_on/],
  [{ hero_image: "https://example.test/image.png" }, /hero_image/],
  [{ related_slugs: ["Bad Slug"] }, /related_slugs/],
  [{ series: " " }, /series must be a non-empty string/],
  [{ series_order: 0 }, /series_order/],
  [{ series_order: 1.5 }, /series_order/],
  [{ content: " " }, /content must be a non-empty string/],
])("rejects invalid editorial values", (change, expected) => {
  expect(() => assertBlogDocument({ ...validBlog, ...change })).toThrow(expected);
});
