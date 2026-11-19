import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/sitemap.mjs";
const { renderSitemap } = __moduleApi0();

test("renders static and repository paths once", () => {
  const sitemap = renderSitemap([], ["/", "/el10/"]);

  expect(sitemap).toContain("<urlset");
  expect(sitemap.match(/<loc>https:\/\/nodejs\.eliware\.org\/<\/loc>/g)).toHaveLength(1);
  expect(sitemap).toContain("https://nodejs.eliware.org/el10/");
  expect(sitemap).toContain("https://nodejs.eliware.org/blog/category/releases");
});

test("encodes blog paths and escapes XML values", () => {
  const sitemap = renderSitemap(
    [
      { slug: "safe slug", updated_at: "2026-01-01&<today>\"'" },
      { slug: "safe slug", updated_at: "unused" },
    ],
    [],
  );

  expect(sitemap).toContain("/blog/safe%20slug");
  expect(sitemap).toContain("2026-01-01&amp;&lt;today&gt;&quot;&apos;");
  expect(sitemap.match(/safe%20slug/g)).toHaveLength(1);
});
