import __moduleApifix1 from "../dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "../format.mjs";
const { formatBytes } = __moduleApifix2();
import { state } from "./state.mjs";
import __moduleApifix3 from "./packages.mjs";
const { releaseFor } = __moduleApifix3();

function packageMatches(entry) {
  const release = releaseFor(entry);
  const needle = state.query.trim().toLowerCase();
  return (
    (!needle || entry.name.toLowerCase().includes(needle)) &&
    (state.format === "all" || entry.package.format === state.format) &&
    (state.channel === "all" || release.channel === state.channel)
  );
}

import __moduleApifixDetail from "./detail.mjs";
const { renderDetail } = __moduleApifixDetail();

function renderSearch() {
  const list = getElement("package-search-results");
  const status = getElement("package-search-status");
  if (!list || !status) return;
  const matches = state.packages.filter(packageMatches);
  list.replaceChildren();
  status.textContent = `${matches.length} matching package${matches.length === 1 ? "" : "s"}`;
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No stable RPM packages match these filters.";
    list.appendChild(empty);
    return;
  }
  matches.slice(0, 12).forEach((entry) => {
    const item = document.createElement("article");
    item.className = "package-result";
    const link = document.createElement("button");
    link.type = "button";
    link.className = "package-result-button";
    const release = releaseFor(entry);
    const name = document.createElement("strong");
    name.textContent = entry.name;
    const metadata = document.createElement("span");
    metadata.textContent = `${entry.package.format.toUpperCase()} · ${release.channel} · ${formatBytes(entry.size || 0)}`;
    link.append(name, metadata);
    link.addEventListener("click", () => renderDetail(entry));
    item.appendChild(link);
    list.appendChild(item);
  });
  if (matches.length > 12) {
    const more = document.createElement("p");
    more.className = "muted small";
    more.textContent = `Showing the first 12 results. Use filters to see more.`;
    list.appendChild(more);
  }
}

export default function __moduleApi0() {
  return { packageMatches, renderSearch };
}
