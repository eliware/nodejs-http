import domApi from "../../dom.mjs";
const { getElement } = domApi();
import imageStateApi from "./state.mjs";
const { setOpenRepository } = imageStateApi();

function renderImageBreadcrumbs(state, render) {
  const breadcrumbs = getElement("image-browser-breadcrumbs");
  if (!breadcrumbs) return;
  breadcrumbs.replaceChildren();
  const root = document.createElement("button");
  root.type = "button";
  root.className = "breadcrumb-link";
  root.textContent = "Images";
  root.addEventListener("click", () => {
    setOpenRepository(state, null);
    render();
  });
  breadcrumbs.appendChild(root);
  if (state.openRepository) {
    const separator = document.createElement("span");
    separator.textContent = " / ";
    breadcrumbs.append(separator);
    const current = document.createElement("span");
    current.textContent = state.openRepository.split("/").at(-1);
    breadcrumbs.append(current);
  }
}

export default function __moduleApi0() {
  return { renderImageBreadcrumbs };
}
