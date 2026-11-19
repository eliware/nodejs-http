import __moduleApi1 from "../api.mjs";
const { origin } = __moduleApi1();
import __moduleApifix1 from "../dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "../format.mjs";
const { formatBytes, formatDateTime } = __moduleApifix2();
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

function renderDetail(entry) {
  const panel = getElement("package-detail-panel");
  if (!panel || !entry) return;
  const release = releaseFor(entry);
  const filename = entry.name;
  const url = `${origin}${entry.href}`;
  const checksum = `${entry.sha256 || "unavailable"}  ${filename}`;
  getElement("package-detail-title").textContent = filename;
  getElement("package-detail-meta").textContent =
    `${entry.package.format.toUpperCase()} · ${release.channel} · ${release.version} · ${formatBytes(entry.size || 0)} · ${formatDateTime(entry.modified)}`;
  getElement("package-detail-hash").textContent = entry.sha256 || "Checksum unavailable";
  getElement("package-detail-link").href = entry.href;
  getElement("package-detail-command").textContent =
    entry.package.format === "rpm"
      ? `curl -fsSLO ${url}\necho "${checksum}" | sha256sum --check -\nsudo dnf install -y ./${filename}`
      : `curl -fsSLO ${url}\necho "${checksum}" | sha256sum --check -\nsudo apt install ./${filename}`;
  panel.hidden = false;
  state.selected = entry;
}

function renderSearch() {
  const list = getElement("package-search-results");
  const status = getElement("package-search-status");
  if (!list || !status) return;
  const matches = state.packages.filter(packageMatches);
  list.replaceChildren();
  status.textContent = `${matches.length} matching package${matches.length === 1 ? "" : "s"}`;
  matches.slice(0, 12).forEach((entry) => {
    const item = document.createElement("article");
    item.className = "package-result";
    const link = document.createElement("button");
    link.type = "button";
    link.className = "package-result-button";
    const release = releaseFor(entry);
    link.innerHTML = `<strong>${entry.name}</strong><span>${entry.package.format.toUpperCase()} · ${release.channel} · ${formatBytes(entry.size || 0)}</span>`;
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
  return { packageMatches, renderDetail, renderSearch };
}
