import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/blog/article.mjs";
const { renderBlogArticle } = __moduleApi0();
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";
import __moduleApifixBlog from "../../../src/frontend/blog.mjs";
const { initBlog } = __moduleApifixBlog();

const post = {
  title: "Safe <title>",
  summary: "A useful summary.",
  published_at: "2026-01-01T12:00:00Z",
  category: "guides",
  content: "one two",
  author: "Eliware",
  html: "<h1>Guide</h1><p>Article</p>",
};

function setup({ hero = true } = {}) {
  const ids = ["blog-status", "blog-list", "blog-article"];
  if (hero) ids.push("blog-hero");
  const { get } = installBrowserDom({ ids });
  return {
    get,
    elements: {
      status: get("blog-status"),
      list: get("blog-list"),
      article: get("blog-article"),
      hero: hero ? get("blog-hero") : null,
    },
  };
}

test("reveals a server-rendered article without fetching it", async () => {
  const { get, elements } = setup();
  elements.article.dataset.serverRendered = "true";
  globalThis.fetch = jest.fn();
  await renderBlogArticle("guide", elements);
  expect(get("blog-list").hidden).toBe(true);
  expect(get("blog-status").hidden).toBe(true);
  expect(elements.hero.hidden).toBe(true);
  expect(get("blog-article").classList.contains("d-none")).toBe(false);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test("renders a fetched article and removes its duplicate heading", async () => {
  const { get, elements } = setup();
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => post }));
  await renderBlogArticle("guide", elements);
  expect(globalThis.document.title).toContain("Safe <title>");
  expect(get("blog-article").innerHTML).toContain("Safe &lt;title&gt;");
  expect(get("blog-article").innerHTML).not.toContain("<h1>Guide</h1>");
  expect(get("blog-article").classList.contains("d-none")).toBe(false);
});

test("renders a fetched article without an optional hero", async () => {
  const { get, elements } = setup({ hero: false });
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => post }));
  await renderBlogArticle("guide", elements);
  expect(get("blog-article").innerHTML).toContain("Safe &lt;title&gt;");
});

test("routes an article path through the blog page coordinator", async () => {
  const { get } = installBrowserDom({ ids: ["blog-status", "blog-list", "blog-article"] });
  globalThis.location = { pathname: "/blog/guide", search: "" };
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => post }));
  await initBlog();
  expect(get("blog-article").innerHTML).toContain("Safe &lt;title&gt;");
});

test("reports an unavailable article response", async () => {
  const { elements } = setup();
  globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 }));
  await expect(renderBlogArticle("guide", elements)).rejects.toThrow("blog request failed: 503");
});
