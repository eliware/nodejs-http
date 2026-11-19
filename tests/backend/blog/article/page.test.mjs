import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/article/page.mjs";
const { renderBlogArticlePage } = __moduleApi0();

const article = () => ({
  title: "Safe <title>",
  summary: 'A "summary" & detail.',
  published_at: "2026-01-01T00:00:00Z",
  author: "Eliware",
  category: "operations <today>",
  content: "# Hidden heading\n\nVisible text.",
  last_verified_at: "2026-01-03T00:00:00Z",
  tested_on: ["Linux", "Node.js"],
  hero_image: "/assets/hero.png?size=large&safe=1",
});

test("assembles escaped article page content and optional metadata", () => {
  const html = renderBlogArticlePage(article());
  expect(html).not.toContain("Hidden heading");
  expect(html).toContain("Visible text.");
  expect(html).toContain("Safe &lt;title&gt;");
  expect(html).toContain("operations &lt;today&gt;");
  expect(html).toContain("A &quot;summary&quot; &amp; detail.");
  expect(html).toContain("1 min read");
  expect(html).toContain("/assets/hero.png?size=large&amp;safe=1");
  expect(html).toContain("Last verified 2026-01-03 · Tested on Linux, Node.js");
  expect(renderBlogArticlePage(null)).toBe("");
  expect(
    renderBlogArticlePage({ ...article(), hero_image: "", last_verified_at: "" }),
  ).not.toContain("blog-hero-image");
});
