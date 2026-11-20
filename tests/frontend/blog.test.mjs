import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../src/frontend/blog.mjs";
const { initBlog } = __moduleApi0();
import { installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

const post = {
  slug: "guide",
  title: "Safe <title>",
  summary: "A useful summary.",
  published_at: "2026-01-01T12:00:00Z",
  category: "guides",
  tags: ["gluster", "install"],
  content: "one two",
  author: "Eliware",
  html: "<h1>Guide</h1><p>Article</p>",
};
function blogDom() {
  const { get } = installBrowserDom({
    ids: ["blog-status", "blog-list", "blog-article", "blog-hero", "blog-search", "blog-category"],
  });
  return { get };
}

test("does nothing when required blog elements are missing", async () => {
  installBrowserDom();
  await initBlog();
});

test("reports a failed blog request", async () => {
  const { get } = blogDom();
  globalThis.location = { pathname: "/blog", search: "" };
  globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 }));
  await initBlog();
  expect(get("blog-status").textContent).toBe("Blog posts are temporarily unavailable.");
});

test("loads category routes without optional search controls", async () => {
  const { get } = (() => {
    const state = installBrowserDom({
      ids: ["blog-status", "blog-list", "blog-article", "blog-category"],
    });
    return { get: state.get };
  })();
  globalThis.location = { pathname: "/blog/category/releases/", search: "" };
  globalThis.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ posts: [post, { ...post, category: "releases", slug: "release" }] }),
  }));
  await initBlog();
  expect(get("blog-status").textContent).toBe("1 matching post");
  expect(get("blog-list").innerHTML).toContain("release");
});

test("handles invalid fetched post data and missing blog controls", async () => {
  installBrowserDom();
  await initBlog();
  const { get } = blogDom();
  globalThis.location = { pathname: "/blog", search: "" };
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) }));
  await initBlog();
  expect(get("blog-status").textContent).toBe("Blog posts are temporarily unavailable.");
});

test("renders the blog index without optional controls", async () => {
  installBrowserDom({ ids: ["blog-status", "blog-list", "blog-article"] });
  globalThis.location = { pathname: "/blog", search: "" };
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ posts: [] }) }));
  await initBlog();
  expect(globalThis.document.getElementById("blog-status").textContent).toBe("0 matching posts");
});
