import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/handlers.mjs";
const { handleDirectoryApi } = __moduleApi0();
import __moduleApifixBlog from "../../../src/backend/api/blog-handler.mjs";
const { handleBlogApi } = __moduleApifixBlog();
import { createRepositoryRoot, writeRepositoryIndex } from "../../../test-fixtures/filesystem.mjs";

function responseFor(method = "GET") {
  return {
    req: { method },
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

const config = { publicDir: "missing-public-root", securityHeaders: false, compression: false };

test("ignores unrelated directory API paths", async () => {
  const response = responseFor();
  await expect(
    handleDirectoryApi({ url: "/api/v1/list" }, response, "/api/v1/other", config),
  ).resolves.toBe(false);
  expect(response.statusCode).toBeNull();
});

test("uses the root path when the directory request has no URL or path query", async () => {
  const response = responseFor();
  await expect(handleDirectoryApi({}, response, "/api/v1/list", config)).resolves.toBe(true);
  expect(response.statusCode).toBe(404);
});

test("serves articles, hides drafts, and handles blog store failures", async () => {
  const empty = responseFor();
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
  const found = responseFor();
  await handleBlogApi(found, "/api/v1/blogs/safe-post", blogConfig);
  expect(found.statusCode).toBe(200);
  expect(JSON.parse(found.body).html).toContain("Article.");
  const absent = responseFor();
  await handleBlogApi(absent, "/api/v1/blogs/not-there", blogConfig);
  expect(absent.statusCode).toBe(404);
  const broken = responseFor();
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

test("returns not found for nested article paths", async () => {
  const result = responseFor();
  await expect(handleBlogApi(result, "/api/v1/blogs/post/extra", config)).resolves.toBe(true);
  expect(result.statusCode).toBe(404);
  expect(JSON.parse(result.body)).toEqual({ error: "blog post not found" });
});

test("normalizes directory API paths and returns successful indexed listings", async () => {
  const publicDir = await createRepositoryRoot();
  await writeRepositoryIndex(publicDir, {
    "/el10/": { entries: [{ name: "gluster.rpm", type: "file" }] },
  });
  const response = responseFor();
  await handleDirectoryApi(
    { url: "/api/v1/list?path=el10&q=gluster&sort=name&order=asc&offset=0&limit=10" },
    response,
    "/api/v1/list",
    { ...config, publicDir },
  );
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).entries[0].name).toBe("gluster.rpm");
  const unavailable = responseFor();
  await handleDirectoryApi(
    { url: "/api/v1/list?path=%2Fmissing" },
    unavailable,
    "/api/v1/list",
    config,
  );
  expect(unavailable.statusCode).toBe(404);
});
