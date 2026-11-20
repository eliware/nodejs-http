import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/blog/cards.mjs";
const { renderBlogCard } = __moduleApi0();

test("renders an escaped blog card with its details and tags", () => {
  const card = renderBlogCard({
    slug: "safe guide",
    title: "Safe <title>",
    summary: "A useful & safe summary.",
    published_at: "2026-01-01T12:00:00Z",
    category: "guides <all>",
    tags: ["gluster", "safe & sound"],
    content: Array.from({ length: 221 }, () => "word").join(" "),
  });
  expect(card).toContain('data-category="guides &lt;all&gt;"');
  expect(card).toContain('data-tags="gluster safe &amp; sound"');
  expect(card).toContain("min read");
  expect(card).toContain('href="/blog/safe%20guide"');
  expect(card).toContain("Safe &lt;title&gt;");
  expect(card).toContain("safe &amp; sound");
});
