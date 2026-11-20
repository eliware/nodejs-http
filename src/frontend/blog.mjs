import __moduleApi1 from "./dom.mjs";
const { getElement } = __moduleApi1();
import blogListApi from "./blog/list.mjs";
const { renderBlogList } = blogListApi();
import __moduleApifixArticle from "./blog/article.mjs";
const { renderBlogArticle } = __moduleApifixArticle();

async function getJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`blog request failed: ${response.status}`);
  return response.json();
}

async function initBlog() {
  const status = getElement("blog-status");
  const list = getElement("blog-list");
  const article = getElement("blog-article");
  const hero = getElement("blog-hero");
  const search = getElement("blog-search");
  const category = getElement("blog-category");
  if (!status || !list || !article) return;
  try {
    const categoryPath = location.pathname.match(/^\/blog\/category\/([^/]+)\/?$/);
    const slug = categoryPath ? "" : location.pathname.replace(/^\/blog\/?/, "");
    if (slug) {
      await renderBlogArticle(slug, { status, list, article, hero });
      return;
    }
    const result = await getJson("/api/v1/blogs");
    const initialCategory = categoryPath
      ? decodeURIComponent(categoryPath[1])
      : new URLSearchParams(location.search).get("category") || "";
    renderBlogList({ posts: result.posts, status, list, search, category, initialCategory });
  } catch {
    status.textContent = "Blog posts are temporarily unavailable.";
  }
}

export default function __moduleApi0() {
  return { initBlog };
}
