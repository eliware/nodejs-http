import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();

function renderBreadcrumbs(path) {
  const breadcrumbs = getElement("directory-breadcrumbs");
  breadcrumbs.replaceChildren();
  const root = document.createElement("a");
  root.href = "/";
  root.textContent = "nodejs.eliware.org";
  breadcrumbs.appendChild(root);
  const parts = path.split("/").filter(Boolean);
  let href = "/";
  parts.forEach((part, index) => {
    const separator = document.createElement("span");
    separator.setAttribute("aria-hidden", "true");
    separator.textContent = "/";
    breadcrumbs.appendChild(separator);
    href += `${encodeURIComponent(part)}/`;
    const crumb = document.createElement(index === parts.length - 1 ? "span" : "a");
    if (crumb instanceof HTMLAnchorElement) crumb.href = href;
    crumb.textContent = decodeURIComponent(part);
    if (index === parts.length - 1) crumb.setAttribute("aria-current", "page");
    breadcrumbs.appendChild(crumb);
  });
}

export default function __moduleApi0() {
  return { renderBreadcrumbs };
}
