import __moduleApi1 from "./validation.mjs";
const { renderValidation } = __moduleApi1();

import __sourceApi0 from "./validation.mjs";
const { distributionLabels, metadataStatus, validationIcon } = __sourceApi0();

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character],
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KiB", "MiB", "GiB", "TiB"];
  let value = bytes;
  let unit = "B";
  for (const nextUnit of units) {
    value /= 1024;
    unit = nextUnit;
    if (value < 1024) break;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`;
}

function copyrightYear() {
  const year = new Date().getUTCFullYear();
  return year <= 2026 ? "2026" : `2026-${year}`;
}

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
  return {
    renderValidation,
    escapeHtml,
    formatBytes,
    copyrightYear,
    ogImageForPath,
    renderBreadcrumbs,
    distributionLabels,
    metadataStatus,
    validationIcon,
  };
}
