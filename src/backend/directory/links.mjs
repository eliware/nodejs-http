import presentationApi from "./presentation.mjs";
const { escapeHtml } = presentationApi();

function ogImageForPath(requestPath) {
  const match = requestPath.match(/^\/metadata\/runs\/([^/]+)/);
  return match
    ? `/metadata/runs/${encodeURIComponent(match[1])}/release-card.png`
    : "/metadata/latest-release-card.png";
}

function renderBreadcrumbs(requestPath) {
  const parts = requestPath.split("/").filter(Boolean);
  const crumbs = ['<a href="/">nodejs.eliware.org</a>'];
  let href = "/";
  for (const [index, part] of parts.entries()) {
    const decoded = decodeURIComponent(part);
    href += `${encodeURIComponent(decoded)}/`;
    const label = escapeHtml(decoded);
    const final = index === parts.length - 1;
    crumbs.push(
      `<span aria-hidden="true">/</span>${final ? `<span aria-current="page">${label}</span>` : `<a href="${escapeHtml(href)}">${label}</a>`}`,
    );
  }
  return crumbs.join(" ");
}

export default function __moduleApi0() {
  return { ogImageForPath, renderBreadcrumbs };
}
