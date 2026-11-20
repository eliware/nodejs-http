import articleRendererApi from "./renderer.mjs";
const { renderBlogContent } = articleRendererApi();
import markdownInlineApi from "../markdown/inline.mjs";
const { escapeHtml } = markdownInlineApi();
import articleHeroApi from "./hero.mjs";
const { renderBlogHero } = articleHeroApi();
import articleVerificationApi from "./verification.mjs";
const { renderVerificationMetadata } = articleVerificationApi();
import __moduleApifixReadingTime from "../../../shared/blog/reading-time.mjs";
const { readingTimeMinutes } = __moduleApifixReadingTime();

function renderBlogArticlePage(blog) {
  if (!blog) return "";
  const html = renderBlogContent(blog.content);
  const verified = renderVerificationMetadata(blog);
  const hero = renderBlogHero(blog);
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> → <a href="/blog">Blog</a> → ${escapeHtml(blog.category)}</nav>${hero}<p class="blog-date"><time datetime="${escapeHtml(blog.published_at)}">${escapeHtml(blog.published_at)}</time></p><h1>${escapeHtml(blog.title)}</h1><p class="lead">${escapeHtml(blog.summary)}</p><p class="blog-byline">By ${escapeHtml(blog.author)} · ${readingTimeMinutes(blog.content)} min read</p>${verified}<div class="blog-content">${html}</div><p><a href="/blog">← All posts</a></p>`;
}

export default function __moduleApi0() {
  return { renderBlogArticlePage };
}
