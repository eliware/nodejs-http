import __moduleApi1 from "../article/page.mjs";
const { renderBlogArticlePage } = __moduleApi1();
import __moduleApifix1 from "./metadata.mjs";
const { blogPageMetadata } = __moduleApifix1();

function renderBlogPage(template, blog, category, hostId) {
  const tokens = {
    ...blogPageMetadata(blog, category, hostId),
    __BLOG_ARTICLE__: renderBlogArticlePage(blog),
  };
  return Object.entries(tokens).reduce(
    (page, [token, value]) => page.replaceAll(token, value),
    template,
  );
}

export default function __moduleApi0() {
  return { renderBlogPage };
}
