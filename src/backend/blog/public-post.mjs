import __moduleApi1 from "./markdown.mjs";
const { renderBlogArticle } = __moduleApi1();

function publicBlogPost(blog) {
  return { ...blog, html: renderBlogArticle(blog) };
}

export default function __moduleApi0() {
  return { publicBlogPost };
}
