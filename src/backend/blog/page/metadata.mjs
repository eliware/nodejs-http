import articleEscapingApi from "../article/attribute-escaping.mjs";
const { escapeAttribute } = articleEscapingApi();
import __moduleApifix1 from "../jsonld.mjs";
const { absoluteBlogImage, renderBlogJsonLd } = __moduleApifix1();
import { APP_VERSION } from "../../app-version.mjs";
import __moduleApifix3 from "../../directory/copyright-year.mjs";
const { copyrightYear } = __moduleApifix3();

const SITE_URL = "https://nodejs.eliware.org";

function blogPageMetadata(blog, category, hostId) {
  const title = blog
    ? `${blog.title} · Eliware Node.js`
    : category
      ? `${category} · Eliware Node.js Blog`
      : "Blog · Eliware Node.js";
  const description = blog?.summary || "Eliware Node.js news, guides, and release notes.";
  const canonical = `${SITE_URL}/blog${blog ? `/${blog.slug}` : category ? `/category/${encodeURIComponent(category)}` : ""}`;
  const version = process.env.APP_VERSION || APP_VERSION;
  return {
    __BLOG_TITLE__: escapeAttribute(title),
    __BLOG_DESCRIPTION__: escapeAttribute(description),
    __BLOG_CANONICAL__: escapeAttribute(canonical),
    __BLOG_OG_TYPE__: blog ? "article" : "website",
    __BLOG_JSONLD__: renderBlogJsonLd(blog),
    __BLOG_IMAGE__: escapeAttribute(absoluteBlogImage(blog?.hero_image)),
    __BLOG_SERVER_RENDERED__: blog ? "true" : "false",
    __BLOG_ARTICLE_CLASS__: blog ? "" : "d-none",
    __BLOG_PAGE_CLASS__: blog ? "blog-article-page" : "",
    __HOST_ID__: hostId,
    __COPYRIGHT_YEAR__: copyrightYear(),
    __APP_VERSION__: escapeAttribute(version),
    __ASSET_VERSION__: escapeAttribute(version),
  };
}

export default function __moduleApi0() {
  return { blogPageMetadata };
}
