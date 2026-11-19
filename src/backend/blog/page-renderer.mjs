import __moduleApi1 from "./article/page.mjs";
const { renderBlogArticlePage } = __moduleApi1();
import articleEscapingApi from "./article/escaping.mjs";
const { escapeAttribute } = articleEscapingApi();
import __moduleApifix1 from "./jsonld.mjs";
const { absoluteBlogImage, renderBlogJsonLd } = __moduleApifix1();
import { APP_VERSION } from "../app-version.mjs";
import __moduleApifix3 from "../directory/presentation.mjs";
const { copyrightYear } = __moduleApifix3();

const SITE_URL = "https://nodejs.eliware.org";

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
    .replaceAll("__BLOG_ARTICLE__", renderBlogArticlePage(blog))
    .replaceAll("__HOST_ID__", hostId)
    .replaceAll("__COPYRIGHT_YEAR__", copyrightYear())
    .replaceAll("__APP_VERSION__", process.env.APP_VERSION || APP_VERSION)
    .replaceAll("__ASSET_VERSION__", process.env.APP_VERSION || APP_VERSION);
}

export default function __moduleApi0() {
  return { renderBlogPage };
}
