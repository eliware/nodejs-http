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

test("renders post cards, escapes text, and filters by search and category", async () => {
  const { get } = blogDom();
  globalThis.location = { pathname: "/blog", search: "?category=guides" };
  globalThis.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      posts: [post, { ...post, slug: "other", category: "releases", title: "Other" }],
    }),
  }));
  const category = get("blog-category");
  category.value = "guides";
  await initBlog();
  expect(get("blog-status").textContent).toBe("1 matching post");
  get("blog-search").value = "no match";
  get("blog-search").dispatch("input");
  expect(get("blog-status").textContent).toBe("0 matching posts");
  get("blog-search").value = "gluster";
  category.value = "releases";
  category.dispatch("change");
  expect(get("blog-list").innerHTML).toContain("Other");
  expect(get("blog-list").innerHTML).not.toContain("Safe &lt;title&gt;");
});

test("shows the server-rendered post without a duplicate network request", async () => {
  const { get } = blogDom();
  globalThis.location = { pathname: "/blog/guide", search: "" };
  get("blog-article").dataset.serverRendered = "true";
  globalThis.fetch = jest.fn();
  await initBlog();
  expect(get("blog-list").hidden).toBe(true);
  expect(get("blog-status").hidden).toBe(true);
  expect(get("blog-article").classList.contains("d-none")).toBe(false);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

test("renders a fetched post safely and hides the index controls", async () => {
  const { get } = blogDom();
  globalThis.location = { pathname: "/blog/guide", search: "" };
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => post }));
  await initBlog();
  expect(globalThis.document.title).toContain("Safe <title>");
  expect(get("blog-article").innerHTML).toContain("Safe &lt;title&gt;");
  expect(get("blog-article").innerHTML).not.toContain("<h1>Guide</h1>");
  expect(get("blog-article").classList.contains("d-none")).toBe(false);
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

test("renders a fetched article without an optional hero", async () => {
  installBrowserDom({ ids: ["blog-status", "blog-list", "blog-article"] });
  globalThis.location = { pathname: "/blog/guide", search: "" };
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => post }));
  await initBlog();
  expect(globalThis.document.getElementById("blog-article").innerHTML).toContain(
    "Safe &lt;title&gt;",
  );
});
