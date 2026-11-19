import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/special-routes.mjs";
const { handleSpecialRequest } = __moduleApi0();
import { createHttpResponse, readHttpBody } from "../../test-fixtures/http-response.mjs";
import { createHealthMetadata, createStaticSite } from "../../test-fixtures/filesystem.mjs";

async function call(requestPath, { method = "GET", config = {} } = {}) {
  const response = createHttpResponse(method, { "accept-encoding": "gzip" });
  const body = readHttpBody(response);
  const result = await handleSpecialRequest(response.req, response, requestPath, {
    publicDir: await createHealthMetadata(),
    staticDir: await createStaticSite(),
    directoryListing: true,
    allowDotfiles: false,
    compression: false,
    compressionMinBytes: 1024,
    securityHeaders: true,
    etag: true,
    lastModified: true,
    defaultMimeType: "application/octet-stream",
    blogStore: { published: async () => [], bySlug: async () => null },
    ...config,
  });
  if (!result) response.end();
  return { response, body: (await body).toString(), result };
}

test("routes health, catalog, and metadata API requests", async () => {
  expect((await call("/health")).response.statusCode).toBe(200);
  expect((await call("/api/v1/catalog")).response.statusCode).toBe(200);
  expect((await call("/api/v1/list")).response.statusCode).toBe(200);
  expect((await call("/api/guides/install/centos10/stable")).response.statusCode).toBe(404);
  expect((await call("/api/v1/blogs")).response.statusCode).toBe(200);
  expect((await call("/api/v1/blogs/missing")).response.statusCode).toBe(404);
  expect((await call("/api/v1/blogs/missing/part")).response.statusCode).toBe(503);
});

test("serves RSS and sitemap documents and their HEAD forms", async () => {
  const rss = await call("/feed.xml");
  expect(rss.response.statusCode).toBe(200);
  expect(rss.response.headers["Content-Type"]).toContain("rss+xml");
  expect(rss.body).toContain("<rss");
  expect((await call("/feed.xml", { method: "HEAD" })).body).toBe("");
  const sitemap = await call("/sitemap.xml", {
    config: {
      blogStore: {
        published: async () => [
          {
            slug: "release",
            updated_at: "2026-01-01&<today>",
          },
        ],
      },
    },
  });
  expect(sitemap.response.statusCode).toBe(200);
  expect(sitemap.body).toContain("<urlset");
  expect(sitemap.body).toContain("/blog/release");
  expect(sitemap.body).toContain("2026-01-01&amp;&lt;today&gt;");
  expect((await call("/sitemap.xml", { method: "HEAD" })).body).toBe("");
});

test("returns unavailable feeds and sitemaps when their stores fail", async () => {
  const failedStore = {
    published: async () => {
      throw new Error("offline");
    },
  };
  expect(
    (await call("/feed.xml", { config: { blogStore: failedStore } })).response.statusCode,
  ).toBe(503);
  expect(
    (await call("/sitemap.xml", { config: { blogStore: failedStore } })).response.statusCode,
  ).toBe(503);
});

test("serves blog pages, redirects old paths, and maps static pages", async () => {
  expect((await call("/blog")).response.statusCode).toBe(200);
  const articleStore = {
    published: async () => [
      {
        slug: "safe-post",
        title: "Safe post",
        summary: "Summary",
        published_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        created_at: "2025-12-31T00:00:00Z",
        author: "Eliware",
        tags: ["safe"],
        category: "operations",
        content: "# Safe post\n\nArticle.",
        last_verified_at: "2026-01-01T00:00:00Z",
        tested_on: ["Linux"],
        hero_image: "/assets/hero.png",
      },
    ],
  };
  const article = await call("/blog/safe-post", { config: { blogStore: articleStore } });
  expect(article.body).toContain("TechArticle");
  expect(article.body).toContain("hero.png");
  expect(article.body).toContain("Last verified");
  const missingTemplate = await call("/blog", {
    config: { staticDir: "C:\\does-not-exist", blogStore: articleStore },
  });
  expect(missingTemplate.result).toBe(false);
  expect((await call("/blog/missing")).response.statusCode).toBe(404);
  const redirect = await call("/blogs/");
  expect(redirect.response.statusCode).toBe(301);
  expect(redirect.response.headers.Location).toBe("/blog");
  expect((await call("/browse/")).body).toBe("browse");
  expect((await call("/install/rocky10/rolling")).body).toBe("install");
  expect((await call("/about/")).body).toBe("about");
  expect((await call("/robots.txt")).body).toBe("User-agent: *");
  expect((await call("/not-special")).result).toBe(false);
});

test("serves static files with HEAD and exposes missing static files to normal routing", async () => {
  const page = await call("/");
  expect(page.response.statusCode).toBe(200);
  expect(page.body).toContain("home");
  expect(page.body).not.toContain("__HOST_ID__");
  expect(page.body).not.toContain("__COPYRIGHT_YEAR__");
  expect(page.body).not.toContain("__APP_VERSION__");
  expect((await call("/web/app.js")).response.headers["Cache-Control"]).toContain("max-age=60");
  expect((await call("/assets/logo.svg")).response.headers["Cache-Control"]).toContain("immutable");
  const favicon = await call("/favicon.ico");
  expect(favicon.response.statusCode).toBe(200);
  expect(favicon.body).toBe("favicon");
  expect((await call("/favicon.ico", { method: "HEAD" })).body).toBe("");
  expect((await call("/", { method: "HEAD" })).body).toBe("");
  expect((await call("/not-found.html")).result).toBe(false);
});

test("uses the configured static index file for the site root", async () => {
  const result = await call("/", { config: { staticIndexFile: "about.html" } });
  expect(result.body).toBe("about");
});
