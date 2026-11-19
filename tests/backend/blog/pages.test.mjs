import { describe, expect, test } from "@jest/globals";
import { once } from "node:events";
import __moduleApifix1 from "../../../src/backend/blog/pages.mjs";
const { serveBlogPage } = __moduleApifix1();
import __moduleApifix2 from "../../../src/backend/static/file-server.mjs";
const { createStaticRequestListener } = __moduleApifix2();
import { fixture, MockResponse, request } from "../../../test-fixtures/blog/http.mjs";
import path from "node:path";

describe("blog HTTP surface", () => {
  test("lists only published posts and returns safe rendered HTML", async () => {
    const response = await request((await fixture()).listener, "/api/v1/blogs");
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.total).toBe(1);
    expect(body.posts[0].slug).toBe("safe-post");
    expect(body.posts[0].html).toContain('<h1 id="hello">Hello</h1>');
    expect(body.posts[0].html).not.toContain("<script>");
    expect(body.posts[0].html).not.toContain("javascript:");
  });

  test("renders RSS and server-side article metadata", async () => {
    const listener = (await fixture()).listener;
    const feed = await request(listener, "/feed.xml");
    expect(feed.statusCode).toBe(200);
    expect(feed.headers["Content-Type"]).toContain("application/rss+xml");
    expect(feed.body.toString()).toContain("safe-post");
    expect(feed.body.toString()).not.toContain("draft-post");

    const article = await request(listener, "/blog/safe-post");
    expect(article.statusCode).toBe(200);
    expect(article.body.toString()).toContain("https://nodejs.eliware.org/blog/safe-post");
    expect(article.body.toString()).toContain('"@type":"TechArticle"');
    expect(article.body.toString()).toContain("<h1>Safe &lt;title&gt;</h1>");
    expect(article.body.toString()).toContain('data-server-rendered="true"');
    expect(article.body.toString().match(/<h1>/g)).toHaveLength(1);
  });

  test("renders the standard site footer on blog pages", async () => {
    const response = await request((await fixture()).listener, "/blog");
    const body = response.body.toString();
    expect(body).toContain('class="site-footer"');
    expect(body).toContain("Eliware · Node.js packaging");
    expect(body).toContain('href="/metadata/catalog.json"');
    expect(body).toMatch(/Host <code>[^<]+<\/code>/);
  });

  test("renders remote hero URLs and articles without verification metadata", async () => {
    const site = await fixture();
    const response = new MockResponse();
    const finished = once(response, "finish");
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
      hero_image: "https://images.example/hero.png",
    };
    await serveBlogPage(response, { method: "GET", headers: {} }, "/blog/remote-hero", {
      ...site.config,
      compression: false,
      blogStore: { published: async () => [article] },
    });
    await finished;
    expect(response.body.toString()).toContain("https://images.example/hero.png");
    expect(response.body.toString()).not.toContain("Last verified");
  });

  test("returns 404 for an unknown blog article", async () => {
    const response = await request((await fixture()).listener, "/blog/missing");
    expect(response.statusCode).toBe(404);
    expect(response.body.toString()).toContain("Blog post not found");
  });

  test("supports HEAD requests for blog pages", async () => {
    const listener = (await fixture()).listener;
    const response = new MockResponse();
    const finished = once(response, "finish");
    listener({ method: "HEAD", url: "/blog", headers: {} }, response);
    await finished;
    expect(response.statusCode).toBe(200);
    expect(response.headers["Content-Length"]).toBeGreaterThan(0);
    expect(response.body.length).toBe(0);
  });

  test("returns false when the blog template is unavailable", async () => {
    const { config } = await fixture();
    config.staticDir = path.join(config.staticDir, "missing");
    const response = await request(createStaticRequestListener(config), "/blog");
    expect(response.statusCode).toBe(404);
  });
});
