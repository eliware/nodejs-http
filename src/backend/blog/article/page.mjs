import articleRendererApi from "./renderer.mjs";
const { renderBlogContent } = articleRendererApi();
import articleEscapingApi from "./escaping.mjs";
const { escapeAttribute, escapeHtml } = articleEscapingApi();
import __moduleApifixReadingTime from "./reading-time.mjs";
const { readingTimeMinutes } = __moduleApifixReadingTime();

function renderBlogArticlePage(blog) {
  if (!blog) return "";
  const html = renderBlogContent(blog.content);
  const verified = blog.last_verified_at
    ? `<p class="blog-meta">Last verified ${escapeHtml(blog.last_verified_at.slice(0, 10))} · Tested on ${escapeHtml(blog.tested_on.join(", "))}</p>`
    : "";
  const hero = blog.hero_image
    ? `<img class="blog-hero-image" src="${escapeAttribute(blog.hero_image)}" alt="${escapeAttribute(blog.title)}" width="1200" height="630" loading="eager" />`
    : "";
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> → <a href="/blog">Blog</a> → ${escapeHtml(blog.category)}</nav>${hero}<p class="blog-date"><time datetime="${escapeAttribute(blog.published_at)}">${escapeHtml(blog.published_at)}</time></p><h1>${escapeHtml(blog.title)}</h1><p class="lead">${escapeHtml(blog.summary)}</p><p class="blog-byline">By ${escapeHtml(blog.author)} · ${readingTimeMinutes(blog.content)} min read</p>${verified}<div class="blog-content">${html}</div><p><a href="/blog">← All posts</a></p>`;
}

export default function __moduleApi0() {
  return { renderBlogArticlePage };
}
