import blogCardsApi from "./cards.mjs";
const { escapeHtml } = blogCardsApi();

function renderBlogCategories(posts, category, initialCategory) {
  if (!category) return;
  const categories = [...new Set(posts.map((post) => post.category))].sort();
  category.innerHTML += categories
    .map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
    .join("");
  category.value = initialCategory;
}

export default function __moduleApi0() {
  return { renderBlogCategories };
}
