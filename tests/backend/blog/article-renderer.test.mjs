import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/blog/article-renderer.mjs";
const { renderBlogArticle } = __moduleApi0();

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

test("renders escaped article content and optional metadata", () => {
  const html = renderBlogArticle(article());

  expect(html).not.toContain("Hidden heading");
  expect(html).toContain("Visible text.");
  expect(html).toContain("Safe &lt;title&gt;");
  expect(html).toContain("operations &lt;today&gt;");
  expect(html).toContain("A &quot;summary&quot; &amp; detail.");
  expect(html).toContain("/assets/hero.png?size=large&amp;safe=1");
  expect(html).toContain("Last verified 2026-01-03 · Tested on Linux, Node.js");
  expect(renderBlogArticle(null)).toBe("");
  expect(renderBlogArticle({ ...article(), hero_image: "", last_verified_at: "" })).not.toContain(
    "blog-hero-image",
  );
});
