import markdownApi from "./markdown.mjs";
const { renderMarkdown } = markdownApi();
import __moduleApifix1 from "../../shared/blog/article-markup.mjs";
const { withoutLeadingTitle } = __moduleApifix1();

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBlogArticle(blog) {
  if (!blog) return "";
  const html = withoutLeadingTitle(renderMarkdown(blog.content));
  const verified = blog.last_verified_at
    ? `<p class="blog-meta">Last verified ${escapeHtml(blog.last_verified_at.slice(0, 10))} · Tested on ${escapeHtml(blog.tested_on.join(", "))}</p>`
    : "";
  const hero = blog.hero_image
    ? `<img class="blog-hero-image" src="${escapeAttribute(blog.hero_image)}" alt="${escapeAttribute(blog.title)}" width="1200" height="630" loading="eager" />`
    : "";
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> → <a href="/blog">Blog</a> → ${escapeHtml(blog.category)}</nav>${hero}<p class="blog-date"><time datetime="${escapeAttribute(blog.published_at)}">${escapeHtml(blog.published_at)}</time></p><h1>${escapeHtml(blog.title)}</h1><p class="lead">${escapeHtml(blog.summary)}</p><p class="blog-byline">By ${escapeHtml(blog.author)} · ${Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 220))} min read</p>${verified}<div class="blog-content">${html}</div><p><a href="/blog">← All posts</a></p>`;
}

export default function __moduleApi0() {
  return { renderBlogArticle, escapeAttribute };
}
