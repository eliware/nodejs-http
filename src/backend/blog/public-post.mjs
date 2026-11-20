import __moduleApi1 from "./markdown.mjs";
const { renderMarkdown } = __moduleApi1();

function publicBlogPost(blog) {
  return { ...blog, html: renderMarkdown(blog.content) };
}

export default function __moduleApi0() {
  return { publicBlogPost };
}
