import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/blog/rss.mjs";
const { renderBlogRss } = __moduleApi0();

test("renders an RSS channel for an empty post list", () => {
  const rss = renderBlogRss([]);

  expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  expect(rss).toContain('<rss version="2.0"');
  expect(rss).toContain("<title>Eliware Node.js blog</title>");
  expect(rss).toContain("<channel>");
  expect(rss).not.toContain("<item>");
});

test("escapes post data and encodes post slugs", () => {
  const rss = renderBlogRss([
    {
      slug: "safe slug",
      title: 'News & <notes> "today"',
      summary: "A <summary> & more.",
      author: "Eliware's team",
      published_at: "2026-01-01T00:00:00Z",
      tags: ["updates", "tools & tips"],
    },
  ]);

  expect(rss).toContain("https://nodejs.eliware.org/blog/safe%20slug");
  expect(rss).toContain("News &amp; &lt;notes&gt; &quot;today&quot;");
  expect(rss).toContain("A &lt;summary&gt; &amp; more.");
  expect(rss).toContain("Eliware&apos;s team");
  expect(rss).toContain("<category>tools &amp; tips</category>");
  expect(rss).toContain("Thu, 01 Jan 2026 00:00:00 GMT");
});
