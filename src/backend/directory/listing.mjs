import path from "node:path";
import { APP_VERSION } from "../app-version.mjs";
import __moduleApi1 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApi1();
import __moduleApifix1 from "./presentation.mjs";
const { copyrightYear, escapeHtml, formatBytes, ogImageForPath, renderBreadcrumbs } =
  __moduleApifix1();
import __moduleApifix2 from "./validation.mjs";
const { renderValidation } = __moduleApifix2();

function renderDirectoryRows(entries, requestPath) {
  const rows = [];
  let fileCount = 0;
  let totalBytes = 0;
  if (requestPath !== "/") {
    const parent = path.posix.dirname(requestPath.replace(/\/$/, ""));
    rows.push(
      `<tr><td class="kind" aria-hidden="true"><span class="kind-symbol">↥</span></td><td class="name"><a href="${escapeHtml(parent)}">Parent directory</a></td><td>—</td><td>—</td></tr>`,
    );
  }
  for (const entry of entries) {
    const stats = entry.stats;
    const isDirectory = stats ? stats.isDirectory() : entry.isDirectory;
    const size = stats ? (isDirectory ? "Directory" : formatBytes(stats.size)) : "—";
    let modified = "—";
    let modifiedIso = "";
    if (stats) {
      modifiedIso = stats.mtime.toISOString();
      modified = modifiedIso.replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
      if (!isDirectory) {
        fileCount += 1;
        totalBytes += stats.size;
      }
    }
    const entryPath = `${requestPath}${encodeURIComponent(entry.name)}${isDirectory ? "/" : ""}`;
    const modifiedAttribute = !isDirectory ? ` data-modified="${modifiedIso}"` : "";
    rows.push(
      `<tr data-name="${escapeHtml(entry.name.toLowerCase())}"><td class="kind" aria-hidden="true"><span class="kind-symbol">${isDirectory ? "▰" : "▤"}</span></td><td class="name"><a href="${escapeHtml(entryPath)}">${escapeHtml(entry.name)}${isDirectory ? "/" : ""}</a></td><td>${size}</td><td class="modified-cell"${modifiedAttribute}>${modified}</td></tr>`,
    );
  }
  return { html: rows.join(""), fileCount, totalBytes };
}

function fallbackHtml(title, rows) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>:root{color-scheme:dark}body{margin:0;background:#080d18;color:#e8eef8;font:15px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:4rem auto;padding:0 1.25rem}h1{font-size:clamp(1.5rem,4vw,2.5rem);word-break:break-all}table{width:100%;border-collapse:collapse;background:#101b2e;border:1px solid #243553;border-radius:12px;overflow:hidden}th,td{text-align:left;padding:.8rem 1rem;border-bottom:1px solid #243553}th{color:#9fb0c7;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em}tr:last-child td{border-bottom:0}tr:hover{background:#172943}a{color:#80d9ff;text-decoration:none}a:hover{text-decoration:underline}.kind{color:#74dcb9;font-size:1.25rem;text-align:center}</style></head><body><main><p><a href="/">Eliware Node.js</a></p><h1>${escapeHtml(title)}</h1><table><thead><tr><th></th><th>Name</th><th>Size</th><th>Modified</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>`;
}

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
  if (!template) return fallbackHtml(title, rows);
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
