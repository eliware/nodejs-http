import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/blog/cards.mjs";
const { renderBlogCard } = __moduleApi0();

test("renders an escaped blog card with its reading time and tags", () => {
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
  expect(card).toContain("2 min read");
  expect(card).toContain('href="/blog/safe%20guide"');
  expect(card).toContain("Safe &lt;title&gt;");
  expect(card).toContain("safe &amp; sound");
});

test("uses a one minute minimum reading time", () => {
  expect(
    renderBlogCard({
      slug: "short",
      title: "Short",
      summary: "Short post",
      published_at: "2026-01-01T12:00:00Z",
      category: "guides",
      tags: [],
      content: "one",
    }),
  ).toContain("1 min read");
});
