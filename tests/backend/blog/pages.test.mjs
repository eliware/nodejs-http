import { expect, test } from "@jest/globals";
import path from "node:path";
import __moduleApi0 from "../../../src/backend/blog/pages.mjs";
const { serveBlogPage } = __moduleApi0();
import { fixture, MockResponse } from "../../../test-fixtures/blog/http.mjs";

test("renders an article with a local hero URL and no verification metadata", async () => {
  const site = await fixture();
  const response = new MockResponse();
  const article = {
    slug: "remote-hero",
    title: "Remote hero",
    summary: "Summary",
    published_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
    created_at: "2025-12-31T00:00:00Z",
    author: "Eliware",
    tags: ["web"],
    category: "operations",
    content: "# Remote hero\n\nArticle.",
    hero_image: "/assets/hero.png",
  };
  const handled = await serveBlogPage(
    response,
    { method: "GET", headers: {} },
    "/blog/remote-hero",
    {
      ...site.config,
      compression: false,
      blogStore: { published: async () => [article] },
    },
  );
  expect(handled).toBe(true);
  expect(response.body.toString()).toContain("https://nodejs.eliware.org/assets/hero.png");
  expect(response.body.toString()).not.toContain("Last verified");
});

test("returns false when the blog template is unavailable", async () => {
  const { config } = await fixture();
  config.staticDir = path.join(config.staticDir, "missing");
  const handled = await serveBlogPage(
    new MockResponse(),
    { method: "GET", headers: {} },
    "/blog",
    config,
  );
  expect(handled).toBe(false);
});
