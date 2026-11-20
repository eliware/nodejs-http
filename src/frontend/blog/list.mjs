import blogCardsApi from "./cards.mjs";
const { renderBlogCard } = blogCardsApi();
import blogCategoriesApi from "./categories.mjs";
const { renderBlogCategories } = blogCategoriesApi();

function renderBlogList({ posts, status, list, search, category, initialCategory }) {
  renderBlogCategories(posts, category, initialCategory);
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
