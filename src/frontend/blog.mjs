import __moduleApi1 from "./dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "./blog/cards.mjs";
const { formatBlogDate, renderBlogCard } = __moduleApifix1();
import __moduleApifix2 from "../shared/blog/article-markup.mjs";
const { withoutLeadingTitle } = __moduleApifix2();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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
      // A post page replaces the list. Remove the list before loading the post to prevent duplicate content.
      list.replaceChildren();
      list.hidden = true;
      status.hidden = true;
      if (hero) hero.hidden = true;
      if (article.dataset.serverRendered === "true") {
        article.classList.remove("d-none");
        return;
      }
      const post = await getJson(`/api/v1/blogs/${encodeURIComponent(slug)}`);
      document.title = `${post.title} · Eliware Node.js`;
      article.innerHTML = `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> → <a href="/blog">Blog</a> → ${escapeHtml(post.category)}</nav><p class="blog-date">${formatBlogDate(post.published_at)}</p><h1>${escapeHtml(post.title)}</h1><p class="lead">${escapeHtml(post.summary)}</p><p class="blog-byline">By ${escapeHtml(post.author)} · ${Math.max(1, Math.ceil(post.content.split(/\s+/).length / 220))} min read</p><div class="blog-content">${withoutLeadingTitle(post.html)}</div><p><a href="/blog">← All posts</a></p>`;
      article.classList.remove("d-none");
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
