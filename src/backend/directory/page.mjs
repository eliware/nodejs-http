import __moduleApifix1 from "./html-escaping.mjs";
const { escapeHtml } = __moduleApifix1();
import __moduleApifix6 from "./byte-format.mjs";
const { formatBytes } = __moduleApifix6();
import __moduleApifix2 from "./links.mjs";
const { ogImageForPath, renderBreadcrumbs } = __moduleApifix2();
import __moduleApifix3 from "./validation.mjs";
const { renderValidation } = __moduleApifix3();
import directoryPageRendererApi from "./page/renderer.mjs";
const { renderDirectoryPage } = directoryPageRendererApi();

function renderDirectoryHtml({
  template,
  requestPath,
  rows,
  fileCount,
  totalBytes,
  validation,
  containerValidation,
  metadata,
}) {
  const title = `Index of ${requestPath}`;
  return renderDirectoryPage(template, title, rows, {
    title: escapeHtml(title),
    ogImage: escapeHtml(ogImageForPath(requestPath)),
    ogDescription: escapeHtml(`Browse signed Eliware Node.js artifacts in ${title}.`),
    rows,
    breadcrumbs: renderBreadcrumbs(requestPath),
    path: escapeHtml(requestPath),
    validation: renderValidation(validation, containerValidation),
    summary: `Total files: ${fileCount} · Total size: ${formatBytes(totalBytes)}`,
    ...metadata,
  });
}

export default function __moduleApi0() {
  return { renderDirectoryHtml };
}
