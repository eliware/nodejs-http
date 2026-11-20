import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/blog/list.mjs";
const { renderBlogList } = __moduleApi0();
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

const posts = [
  {
    slug: "guide",
    title: "Safe <title>",
    summary: "A useful summary.",
    published_at: "2026-01-01T12:00:00Z",
    category: "guides",
    tags: ["gluster", "install"],
    content: "one two",
  },
  {
    slug: "release",
    title: "Stable release",
    summary: "A release summary.",
    published_at: "2026-01-02T12:00:00Z",
    category: "releases",
    tags: ["node"],
    content: "one two",
  },
];

function listDom() {
  const { get } = installBrowserDom({
    ids: ["blog-status", "blog-list", "blog-search", "blog-category"],
  });
  return {
    status: get("blog-status"),
    list: get("blog-list"),
    search: get("blog-search"),
    category: get("blog-category"),
  };
}

test("renders cards and filters by search and category", () => {
  const elements = listDom();
  elements.category.value = "guides";
  renderBlogList({ posts, ...elements, initialCategory: "guides" });
  expect(elements.status.textContent).toBe("1 matching post");
  expect(elements.list.innerHTML).toContain("Safe &lt;title&gt;");

  elements.search.value = "no match";
  elements.search.dispatch("input");
  expect(elements.status.textContent).toBe("0 matching posts");

  elements.search.value = "node";
  elements.category.value = "releases";
  elements.category.dispatch("change");
  expect(elements.list.innerHTML).toContain("Stable release");
  expect(elements.list.innerHTML).not.toContain("Safe &lt;title&gt;");
});

test("renders an empty list when no posts match", () => {
  const elements = listDom();
  renderBlogList({ posts: [], ...elements, initialCategory: "" });
  expect(elements.status.textContent).toBe("0 matching posts");
  expect(elements.list.innerHTML).toBe("");
});
