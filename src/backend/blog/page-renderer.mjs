import __moduleApi1 from "./markdown.mjs";
const { renderMarkdown } = __moduleApi1();
import __moduleApifix1 from "./jsonld.mjs";
const { absoluteBlogImage, renderBlogJsonLd } = __moduleApifix1();
import __moduleApifix2 from "../../shared/blog/article-markup.mjs";
const { withoutLeadingTitle } = __moduleApifix2();
import { APP_VERSION } from "../app-version.mjs";
import __moduleApifix3 from "../directory/listing-markup.mjs";
const { copyrightYear } = __moduleApifix3();

const SITE_URL = "https://nodejs.eliware.org";

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

function renderBlogPage(template, blog, category, hostId) {
  const title = blog
    ? `${blog.title} · Eliware Node.js`
    : category
      ? `${category} · Eliware Node.js Blog`
      : "Blog · Eliware Node.js";
  const description = blog?.summary || "Eliware Node.js news, guides, and release notes.";
  const canonical = `${SITE_URL}/blog${blog ? `/${blog.slug}` : category ? `/category/${encodeURIComponent(category)}` : ""}`;
  return template
    .replaceAll("__BLOG_TITLE__", escapeAttribute(title))
    .replaceAll("__BLOG_DESCRIPTION__", escapeAttribute(description))
    .replaceAll("__BLOG_CANONICAL__", escapeAttribute(canonical))
    .replaceAll("__BLOG_OG_TYPE__", blog ? "article" : "website")
    .replaceAll("__BLOG_JSONLD__", renderBlogJsonLd(blog))
    .replaceAll("__BLOG_IMAGE__", escapeAttribute(absoluteBlogImage(blog?.hero_image)))
    .replaceAll("__BLOG_SERVER_RENDERED__", blog ? "true" : "false")
    .replaceAll("__BLOG_ARTICLE_CLASS__", blog ? "" : "d-none")
    .replaceAll("__BLOG_PAGE_CLASS__", blog ? "blog-article-page" : "")
    .replaceAll("__BLOG_ARTICLE__", renderBlogArticle(blog))
    .replaceAll("__HOST_ID__", hostId)
    .replaceAll("__COPYRIGHT_YEAR__", copyrightYear())
    .replaceAll("__APP_VERSION__", process.env.APP_VERSION || APP_VERSION)
    .replaceAll("__ASSET_VERSION__", process.env.APP_VERSION || APP_VERSION);
}

export default function __moduleApi0() {
  return { renderBlogArticle, renderBlogPage };
}
