import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/blog/jsonld.mjs";
const { absoluteBlogImage, renderBlogJsonLd } = __moduleApi0();

const article = () => ({
  slug: "safe-post",
  title: "Safe <title>",
  summary: "A summary.",
  published_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
  created_at: "2025-12-31T00:00:00Z",
  author: "Eliware",
  tags: ["web", "gluster"],
  category: "operations",
  hero_image: "/assets/hero.png",
});

test("creates absolute image URLs for local and remote images", () => {
  expect(absoluteBlogImage("/assets/hero.png")).toBe("https://nodejs.eliware.org/assets/hero.png");
  expect(absoluteBlogImage("https://images.example/hero.png")).toBe(
    "https://images.example/hero.png",
  );
  expect(absoluteBlogImage("")).toBe("https://nodejs.eliware.org/assets/eliware-brand.svg");
  expect(absoluteBlogImage(undefined)).toBe("https://nodejs.eliware.org/assets/eliware-brand.svg");
});

test("creates article structured data and escapes script delimiters", () => {
  const result = JSON.parse(renderBlogJsonLd(article()));

  expect(result["@type"]).toBe("TechArticle");
  expect(result.image).toBe("https://nodejs.eliware.org/assets/hero.png");
  expect(result.keywords).toBe("web, gluster");
  expect(result.mainEntityOfPage).toBe("https://nodejs.eliware.org/blog/safe-post");
  expect(renderBlogJsonLd({ ...article(), title: "<script>" })).toContain("\\u003cscript>");
});

test("creates structured data for the blog index", () => {
  const result = JSON.parse(renderBlogJsonLd(null));

  expect(result["@type"]).toBe("Blog");
  expect(result.url).toBe("https://nodejs.eliware.org/blog");
});
