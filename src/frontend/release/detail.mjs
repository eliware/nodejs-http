import __moduleApi1 from "../api.mjs";
const { origin } = __moduleApi1();
import __moduleApifix1 from "../dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "../format.mjs";
const { formatBytes, formatDateTime } = __moduleApifix2();
import { state } from "./state.mjs";
import __moduleApifix3 from "./packages.mjs";
const { releaseFor } = __moduleApifix3();

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

export default function __moduleApi0() {
  return { renderDetail };
}
