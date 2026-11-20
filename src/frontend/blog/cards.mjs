import dateFormatApi from "./date-format.mjs";
const { formatBlogDate } = dateFormatApi();
import readingTimeApi from "../../shared/blog/reading-time.mjs";
const { readingTimeMinutes } = readingTimeApi();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBlogCard(post) {
  const tags = post.tags.map((tag) => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join("");
  const minutes = readingTimeMinutes(post.content);
  return `<article class="blog-card" data-category="${escapeHtml(post.category)}" data-tags="${escapeHtml(post.tags.join(" "))}"><p class="blog-date">${formatBlogDate(post.published_at)} · ${minutes} min read</p><p class="eyebrow">${escapeHtml(post.category)}</p><h2><a href="/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.summary)}</p><div class="blog-tags">${tags}</div></article>`;
}

export default function __moduleApi0() {
  return { escapeHtml, renderBlogCard };
}
