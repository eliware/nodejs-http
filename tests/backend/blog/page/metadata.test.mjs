import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/page/metadata.mjs";
const { blogPageMetadata } = __moduleApi0();

test("resolves escaped article and category metadata", () => {
  const article = blogPageMetadata(
    {
      slug: "release",
      title: "Release <notes>",
      summary: "News & updates",
      hero_image: "/hero.png",
      tags: ["node", "release"],
      category: "releases",
      published_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
      created_at: "2025-12-31T00:00:00Z",
      author: "Eliware",
    },
    "",
    "host-1",
  );
  expect(article.__BLOG_TITLE__).toContain("Release &lt;notes&gt;");
  expect(article.__BLOG_DESCRIPTION__).toBe("News &amp; updates");
  expect(article.__BLOG_CANONICAL__).toBe("https://nodejs.eliware.org/blog/release");
  expect(article.__BLOG_OG_TYPE__).toBe("article");
  expect(article.__BLOG_SERVER_RENDERED__).toBe("true");
  expect(article.__HOST_ID__).toBe("host-1");
  const category = blogPageMetadata(null, "release & news", "host-2");
  expect(category.__BLOG_TITLE__).toContain("release &amp; news");
  expect(category.__BLOG_CANONICAL__).toContain("release%20%26%20news");
  expect(category.__BLOG_ARTICLE_CLASS__).toBe("d-none");
});

test("escapes configured versions before placing them in page tokens", () => {
  const original = process.env.APP_VERSION;
  process.env.APP_VERSION = '<img src=x onerror="run()">';
  try {
    const metadata = blogPageMetadata(null, "", "host");
    expect(metadata.__APP_VERSION__).toBe("&lt;img src=x onerror=&quot;run()&quot;&gt;");
    expect(metadata.__ASSET_VERSION__).toBe(metadata.__APP_VERSION__);
  } finally {
    if (original === undefined) delete process.env.APP_VERSION;
    else process.env.APP_VERSION = original;
  }
});
