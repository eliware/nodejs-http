import markdownInlineApi from "../markdown/inline.mjs";
const { escapeHtml } = markdownInlineApi();

function renderBlogHero(blog) {
  return blog.hero_image
    ? `<img class="blog-hero-image" src="${escapeHtml(blog.hero_image)}" alt="${escapeHtml(blog.title)}" width="1200" height="630" loading="eager" />`
    : "";
}

export default function __moduleApi0() {
  return { renderBlogHero };
}
