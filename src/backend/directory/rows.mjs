import path from "node:path";
import __moduleApifix1 from "./presentation.mjs";
const { escapeHtml, formatBytes } = __moduleApifix1();

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

export default function __moduleApi0() {
  return { renderDirectoryRows };
}
