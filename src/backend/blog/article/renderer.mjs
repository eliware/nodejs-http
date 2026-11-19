import markdownApi from "../markdown.mjs";
const { renderMarkdown } = markdownApi();
import __moduleApifix1 from "../../../shared/blog/article-markup.mjs";
const { withoutLeadingTitle } = __moduleApifix1();

function renderBlogContent(content) {
  return withoutLeadingTitle(renderMarkdown(content));
}

export default function __moduleApi0() {
  return { renderBlogContent };
}
