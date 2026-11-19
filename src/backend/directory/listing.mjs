import { APP_VERSION } from "../app-version.mjs";
import __moduleApi1 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApi1();
import __moduleApifix1 from "./presentation.mjs";
const { copyrightYear, escapeHtml, formatBytes } = __moduleApifix1();
import __moduleApifix4 from "./rows.mjs";
const { renderDirectoryRows } = __moduleApifix4();
import __moduleApifix3 from "./links.mjs";
const { ogImageForPath, renderBreadcrumbs } = __moduleApifix3();
import __moduleApifix2 from "./validation.mjs";
const { renderValidation } = __moduleApifix2();
import __moduleApifixFallback from "./fallback.mjs";
const { renderFallbackHtml } = __moduleApifixFallback();

function renderDirectoryHtml({
  template,
  requestPath,
  rows,
  fileCount,
  totalBytes,
  validation,
  containerValidation,
}) {
  const title = `Index of ${requestPath}`;
  if (!template) return renderFallbackHtml(title, rows);
  return template
    .replaceAll("{{TITLE}}", escapeHtml(title))
    .replaceAll("{{OG_IMAGE}}", escapeHtml(ogImageForPath(requestPath)))
    .replaceAll(
      "{{OG_DESCRIPTION}}",
      escapeHtml(`Browse signed Eliware Node.js artifacts in ${title}.`),
    )
    .replaceAll("{{ROWS}}", rows)
    .replaceAll("{{BREADCRUMBS}}", renderBreadcrumbs(requestPath))
    .replaceAll("{{PATH}}", escapeHtml(requestPath))
    .replaceAll("{{VALIDATION}}", renderValidation(validation, containerValidation))
    .replaceAll("{{SUMMARY}}", `Total files: ${fileCount} · Total size: ${formatBytes(totalBytes)}`)
    .replaceAll("__COPYRIGHT_YEAR__", copyrightYear())
    .replaceAll("__APP_VERSION__", process.env.APP_VERSION || APP_VERSION)
    .replaceAll("__HOST_ID__", servingHostId())
    .replaceAll("__ASSET_VERSION__", process.env.APP_VERSION || APP_VERSION);
}

export default function __moduleApi0() {
  return { renderDirectoryRows, renderDirectoryHtml };
}
