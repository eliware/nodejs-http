import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/page/renderer.mjs";
const { renderBlogPage } = __moduleApi0();

const article = () => ({
  slug: "safe-post",
  title: "Safe <title>",
  summary: 'A "summary" & detail.',
  published_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
  created_at: "2025-12-31T00:00:00Z",
  author: "Eliware",
  tags: ["web", "gluster"],
  category: "operations <today>",
  content: "# Hidden heading\n\nVisible text.",
  last_verified_at: "2026-01-03T00:00:00Z",
  tested_on: ["Linux", "Node.js"],
  hero_image: "/assets/hero.png?size=large&safe=1",
});

test("fills blog templates for article, category, and index pages", () => {
  const template =
    "__BLOG_TITLE__|__BLOG_DESCRIPTION__|__BLOG_CANONICAL__|__BLOG_OG_TYPE__|__BLOG_IMAGE__|__BLOG_SERVER_RENDERED__|__BLOG_ARTICLE_CLASS__|__BLOG_PAGE_CLASS__|__BLOG_JSONLD__|__BLOG_ARTICLE__|__HOST_ID__|__ASSET_VERSION__|__COPYRIGHT_YEAR__|__APP_VERSION__";
  const articlePage = renderBlogPage(template, article(), "", "host-1");
  const categoryPage = renderBlogPage(template, null, "release & news", "host-2");
  const indexPage = renderBlogPage(template, null, "", "host-3");

  expect(articlePage).toContain("Safe &lt;title&gt; · Eliware Node.js");
  expect(articlePage).toContain("https://nodejs.eliware.org/blog/safe-post");
  expect(articlePage).toContain("article|https://nodejs.eliware.org/assets/hero.png");
  expect(articlePage).toContain("true||blog-article-page");
  expect(articlePage).toContain("host-1");
  expect(articlePage).toContain("2026");
  expect(articlePage).toContain("15.2.1");
  expect(articlePage).not.toContain("__ASSET_VERSION__");
  expect(articlePage).not.toContain("__COPYRIGHT_YEAR__");
  expect(articlePage).not.toContain("__APP_VERSION__");
  expect(categoryPage).toContain("release &amp; news · Eliware Node.js Blog");
  expect(categoryPage).toContain("/blog/category/release%20%26%20news");
  expect(categoryPage).toContain("website|https://nodejs.eliware.org/assets/eliware-brand.svg");
  expect(categoryPage).toContain("false|d-none||");
  expect(indexPage).toContain("Blog · Eliware Node.js");
  expect(indexPage).toContain("host-3");
});
