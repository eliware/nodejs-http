import blogCardsApi from "./cards.mjs";
const { escapeHtml, renderBlogCard } = blogCardsApi();

function renderBlogList({ posts, status, list, search, category, initialCategory }) {
  const categories = [...new Set(posts.map((post) => post.category))].sort();
  if (category) {
    category.innerHTML += categories
      .map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
      .join("");
    category.value = initialCategory;
  }
  const render = () => {
    const query = (search?.value || "").toLowerCase().trim();
    const selected = category?.value || "";
    const matchingPosts = posts.filter(
      (post) =>
        (!selected || post.category === selected) &&
        (!query ||
          `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase().includes(query)),
    );
    list.innerHTML = matchingPosts.map(renderBlogCard).join("");
    status.textContent = `${matchingPosts.length} matching post${matchingPosts.length === 1 ? "" : "s"}`;
  };
  search?.addEventListener("input", render);
  category?.addEventListener("change", render);
  render();
}

export default function __moduleApi0() {
  return { renderBlogList };
}
