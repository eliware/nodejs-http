import { expect, test } from "@jest/globals";
import path from "node:path";
import __moduleApi0 from "../../../src/backend/blog/store.mjs";
const { createBlogStore, loadBlogs } = __moduleApi0();
import __moduleApifix1 from "../../../src/backend/blog/schema.mjs";
const { BLOG_SCHEMA } = __moduleApifix1();
import __moduleApifix2 from "../../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix2();
import {
  createBlogDocuments,
  createBlogFile,
  fixture,
  replaceBlogFileWithoutChangingTimestamp,
} from "../../../test-fixtures/blog/http.mjs";

function validBlog(overrides = {}) {
  return {
    metadata_version: SUPPORTED_METADATA_VERSION,
    schema: BLOG_SCHEMA,
    slug: "valid-post",
    title: "Valid title",
    summary: "Valid summary",
    published_at: "2026-08-18T12:00:00Z",
    updated_at: "2026-08-18T12:00:00Z",
    author: "Eliware",
    tags: ["gluster"],
    status: "published",
    content: "Content",
    content_format: "markdown",
    created_at: "2026-08-18T11:00:00Z",
    category: "operations",
    last_verified_at: "2026-08-18T12:00:00Z",
    tested_on: ["Repository content review"],
    ...overrides,
  };
}

test("loads an absent blog directory as an empty collection", async () => {
  const missing = path.resolve("test-fixtures/missing-blog-directory");

  await expect(loadBlogs(missing)).resolves.toEqual([]);
  await expect(createBlogStore(missing).all()).resolves.toEqual([]);
});

test("sorts blog posts by date and slug and ignores other files", async () => {
  const documents = [
    validBlog({
      slug: "z-post",
      published_at: "2026-08-17T12:00:00Z",
      created_at: "2026-08-17T11:00:00Z",
      updated_at: "2026-08-17T12:00:00Z",
    }),
    validBlog({ slug: "b-post" }),
    validBlog({ slug: "a-post" }),
  ];
  const root = await createBlogDocuments(documents, { "notes.txt": "ignored" });

  await expect(loadBlogs(root)).resolves.toMatchObject([
    { slug: "a-post" },
    { slug: "b-post" },
    { slug: "z-post" },
  ]);
});

test("rejects duplicate slugs and malformed JSON with source paths", async () => {
  const duplicateRoot = await createBlogDocuments([validBlog(), validBlog()]);
  const brokenRoot = await createBlogDocuments([], { "broken.json": "not json" });

  await expect(loadBlogs(duplicateRoot)).rejects.toThrow("duplicate blog slug");
  await expect(loadBlogs(brokenRoot)).rejects.toThrow("broken.json");
});

test("reports filesystem and argument errors while loading posts", async () => {
  const file = await createBlogFile("not-a-directory", "content");

  await expect(loadBlogs(file)).rejects.toMatchObject({ code: "ENOTDIR" });
  await expect(createBlogStore("invalid\u0000blog-path").all()).rejects.toThrow();
  await expect(createBlogStore(null).all()).rejects.toMatchObject({
    code: "ERR_INVALID_ARG_TYPE",
  });
});

test("caches posts and returns only published posts by slug", async () => {
  const { blogs } = await fixture();
  const store = createBlogStore(blogs);
  const first = await store.all();

  expect(await store.all()).toBe(first);
  expect((await store.published()).map((blog) => blog.slug)).toEqual(["safe-post"]);
  expect((await store.bySlug("safe-post")).slug).toBe("safe-post");
  await expect(store.bySlug("draft-post")).resolves.toBeNull();
  await expect(store.bySlug("missing-post")).resolves.toBeNull();
});

test("refreshes cached posts when same-size content keeps its timestamp", async () => {
  const original = validBlog({ title: "Valid title" });
  const blogs = await createBlogDocuments([original]);
  const store = createBlogStore(blogs);
  const first = await store.all();
  const updated = { ...original, title: "Other title" };
  const content = JSON.stringify(updated);
  expect(content).toHaveLength(JSON.stringify(original).length);
  await replaceBlogFileWithoutChangingTimestamp(path.join(blogs, "0.json"), content);
  const next = await store.all();
  expect(next).not.toBe(first);
  expect(next[0].title).toBe("Other title");
});
