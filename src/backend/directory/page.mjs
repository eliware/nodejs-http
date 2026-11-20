import { APP_VERSION } from "../app-version.mjs";
import __moduleApi1 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApi1();
import __moduleApifix1 from "./html-escaping.mjs";
const { escapeHtml } = __moduleApifix1();
import __moduleApifix6 from "./byte-format.mjs";
const { formatBytes } = __moduleApifix6();
import __moduleApifix7 from "./copyright-year.mjs";
const { copyrightYear } = __moduleApifix7();
import __moduleApifix2 from "./links.mjs";
const { ogImageForPath, renderBreadcrumbs } = __moduleApifix2();
import __moduleApifix3 from "./validation.mjs";
const { renderValidation } = __moduleApifix3();
import __moduleApifix4 from "./fallback.mjs";
const { renderFallbackHtml } = __moduleApifix4();
import __moduleApifix5 from "./template.mjs";
const { renderDirectoryTemplate } = __moduleApifix5();

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
  const appVersion = process.env.APP_VERSION || APP_VERSION;
  return renderDirectoryTemplate(template, {
    title: escapeHtml(title),
    ogImage: escapeHtml(ogImageForPath(requestPath)),
    ogDescription: escapeHtml(`Browse signed Eliware Node.js artifacts in ${title}.`),
    rows,
    breadcrumbs: renderBreadcrumbs(requestPath),
    path: escapeHtml(requestPath),
    validation: renderValidation(validation, containerValidation),
    summary: `Total files: ${fileCount} · Total size: ${formatBytes(totalBytes)}`,
    copyrightYear: copyrightYear(),
    appVersion,
    hostId: servingHostId(),
    assetVersion: appVersion,
  });
}

export default function __moduleApi0() {
  return { renderDirectoryHtml };
}
