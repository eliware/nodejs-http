import __moduleApi1 from "./api.mjs";
const { fetchDirectory } = __moduleApi1();
import __moduleApifix1 from "./dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "./directory/entries.mjs";
const { renderEntries } = __moduleApifix2();
import __moduleApifix3 from "./directory/breadcrumbs.mjs";
const { renderBreadcrumbs } = __moduleApifix3();
import __moduleApifix4 from "./directory/validation.mjs";
const { renderValidation } = __moduleApifix4();

let currentListing;
let sortKey = "type";
let ascending = true;
let filterQuery = "";
let runtimeOnly = false;

function render() {
  renderEntries({ listing: currentListing, sortKey, ascending, filterQuery, runtimeOnly });
}

function updateSortButtons() {
  document.querySelectorAll(".sort-button").forEach((button) => {
    const selected = button.dataset.sortKey === sortKey;
    const header = button.closest("th");
    button.classList.toggle("active", selected);
    if (header)
      header.setAttribute(
        "aria-sort",
        selected ? (ascending ? "ascending" : "descending") : "none",
      );
    const arrow = button.querySelector("span");
    if (arrow) arrow.textContent = selected ? (ascending ? "↑" : "↓") : "↕";
  });
}

async function initDirectoryBrowser() {
  const entries = getElement("directory-entries");
  if (!entries || !getElement("directory-title")) return;
  const currentPath = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  currentListing = await fetchDirectory(currentPath);
  renderValidation(currentListing);
  getElement("directory-title").textContent = `Index of ${currentListing.path}`;
  const pathElement = getElement("directory-path");
  if (pathElement) pathElement.textContent = currentListing.path;
  if (getElement("directory-breadcrumbs")) renderBreadcrumbs(currentListing.path);
  getElement("directory-status").textContent = `${currentListing.entries.length} entries`;
  document.querySelectorAll(".sort-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (sortKey === button.dataset.sortKey) ascending = !ascending;
      else {
        sortKey = button.dataset.sortKey;
        ascending = true;
      }
      updateSortButtons();
      render();
    });
  });
  const filter = getElement("directory-filter");
  filter?.addEventListener("input", () => {
    filterQuery = filter.value.trim().toLowerCase();
    render();
  });
  const view = getElement("directory-view");
  view?.addEventListener("change", () => {
    runtimeOnly = view.value === "runtime";
    render();
  });
  updateSortButtons();
  render();
}

export default function __moduleApi0() {
  return { initDirectoryBrowser };
}
