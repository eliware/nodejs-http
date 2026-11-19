import markdownBlocksApi from "./markdown/blocks.mjs";
const { renderMarkdown } = markdownBlocksApi();

function renderBlogArticle(blog) {
  return renderMarkdown(blog.content);
}

export default function __moduleApi0() {
  return { renderMarkdown, renderBlogArticle };
}
