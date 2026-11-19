import __moduleApi1 from "./dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "./blog/cards.mjs";
const { escapeHtml, renderBlogCard } = __moduleApifix1();
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
    const categories = [...new Set(result.posts.map((post) => post.category))].sort();
    if (category)
      category.innerHTML += categories
        .map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
        .join("");
    if (category) category.value = initialCategory;
    const render = () => {
      const query = (search?.value || "").toLowerCase().trim();
      const selected = category?.value || "";
      const posts = result.posts.filter(
        (post) =>
          (!selected || post.category === selected) &&
          (!query ||
            `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase().includes(query)),
      );
      list.innerHTML = posts.map(renderBlogCard).join("");
      status.textContent = `${posts.length} matching post${posts.length === 1 ? "" : "s"}`;
    };
    search?.addEventListener("input", render);
    category?.addEventListener("change", render);
    render();
  } catch {
    status.textContent = "Blog posts are temporarily unavailable.";
  }
}

export default function __moduleApi0() {
  return { initBlog };
}
