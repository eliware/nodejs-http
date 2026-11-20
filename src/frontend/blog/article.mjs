import __moduleApifix1 from "./cards.mjs";
const { escapeHtml } = __moduleApifix1();
import __moduleApifix3 from "./date-format.mjs";
const { formatBlogDate } = __moduleApifix3();
import __moduleApifix2 from "../../shared/blog/article-markup.mjs";
const { withoutLeadingTitle } = __moduleApifix2();

async function getJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`blog request failed: ${response.status}`);
  return response.json();
}

async function renderBlogArticle(slug, { status, list, article, hero }) {
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
}

export default function __moduleApi0() {
  return { renderBlogArticle };
}
