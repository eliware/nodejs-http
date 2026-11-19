import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/blog-handler.mjs";
const { handleBlogApi } = __moduleApi0();

function response() {
  return {
    req: { method: "GET", headers: {} },
    statusCode: null,
    headers: {},
    body: "",
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body) {
      if (body !== undefined) this.body += body.toString();
    },
  };
}

const config = { securityHeaders: false, compression: false };

test("ignores paths outside the blog API", async () => {
  await expect(handleBlogApi(response(), "/api/v1/blogs-extra", config)).resolves.toBe(false);
});

test("serves published posts and handles missing articles and store failures", async () => {
  const empty = response();
  await handleBlogApi(empty, "/api/v1/blogs", {
    ...config,
    blogStore: { published: async () => [] },
  });
  expect(empty.statusCode).toBe(200);
  expect(JSON.parse(empty.body).posts).toEqual([]);

  const article = {
    slug: "safe-post",
    title: "Safe post",
    summary: "Summary",
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    created_at: "2025-12-31T00:00:00Z",
    category: "operations",
    tags: ["operations"],
    author: "Eliware",
    content: "# Safe post\n\nArticle.",
  };
  const blogConfig = {
    ...config,
    blogStore: {
      published: async () => [article],
      bySlug: async (slug) => (slug === article.slug ? article : null),
    },
  };
  const found = response();
  await handleBlogApi(found, "/api/v1/blogs/safe-post", blogConfig);
  expect(found.statusCode).toBe(200);
  expect(JSON.parse(found.body).html).toContain("Article.");
  const absent = response();
  await handleBlogApi(absent, "/api/v1/blogs/not-there", blogConfig);
  expect(absent.statusCode).toBe(404);
  const broken = response();
  await handleBlogApi(broken, "/api/v1/blogs", {
    ...config,
    blogStore: {
      published: async () => {
        throw new Error("offline");
      },
    },
  });
  expect(broken.statusCode).toBe(503);
  expect(JSON.parse(broken.body)).toEqual({ error: "blog metadata unavailable" });
});

test("rejects nested article paths", async () => {
  const result = response();
  await expect(handleBlogApi(result, "/api/v1/blogs/post/extra", config)).resolves.toBe(true);
  expect(result.statusCode).toBe(404);
  expect(JSON.parse(result.body)).toEqual({ error: "blog post not found" });
});

test("rejects article slugs containing encoded path separators", async () => {
  const result = response();
  await expect(handleBlogApi(result, "/api/v1/blogs/safe/post", config)).resolves.toBe(true);
  expect(result.statusCode).toBe(404);
  expect(JSON.parse(result.body)).toEqual({ error: "blog post not found" });
});
