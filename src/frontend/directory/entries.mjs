import __moduleApi1 from "../format.mjs";
const { formatBytes, formatDateTime } = __moduleApi1();
import __moduleApifix1 from "../dom.mjs";
const { getElement } = __moduleApifix1();

function parentPath(path) {
  return path.split("/").slice(0, -2).join("/") || "/";
}

function formatModified(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  const absolute = formatDateTime(date);
  const elapsedSeconds = (Date.now() - date.getTime()) / 1000;
  const absoluteElapsed = Math.abs(elapsedSeconds);
  const units = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];
  const [unit, divisor] = units.find(([, seconds]) => absoluteElapsed >= seconds) || units.at(-1);
  const relativeValue = Math.round(-elapsedSeconds / divisor);
  const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "always" }).format(
    relativeValue,
    unit,
  );
  return { absolute, relative, iso: date.toISOString() };
}

function addEntryRow(table, entry) {
  const row = document.createElement("tr");
  const icon = document.createElement("td");
  const name = document.createElement("td");
  const size = document.createElement("td");
  const modified = document.createElement("td");
  name.className = "name";
  modified.className = "modified-cell";
  icon.className = "kind";
  icon.setAttribute("aria-hidden", "true");
  const iconSymbol = document.createElement("span");
  iconSymbol.className = "kind-symbol glyph";
  iconSymbol.textContent = entry.type === "directory" ? "▰" : "▤";
  icon.appendChild(iconSymbol);
  const link = document.createElement("a");
  link.href =
    entry.type === "directory" ? `/browse?path=${encodeURIComponent(entry.href)}` : entry.href;
  link.textContent = `${entry.name}${entry.type === "directory" ? "/" : ""}`;
  name.appendChild(link);
  size.textContent = entry.size == null ? "Directory" : formatBytes(entry.size);
  const modifiedDate = formatModified(entry.modified);
  if (modifiedDate) {
    const absolute = document.createElement("time");
    absolute.className = "modified-absolute";
    absolute.dateTime = modifiedDate.iso;
    absolute.textContent = modifiedDate.absolute;
    const relative = document.createElement("span");
    relative.className = "modified-relative";
    relative.textContent = modifiedDate.relative;
    modified.append(absolute, relative);
  } else modified.textContent = "—";
  row.append(icon, name, size, modified);
  table.appendChild(row);
}

function compareEntries(left, right, sortKey) {
  if (sortKey === "type") {
    const leftType = left.type === "directory" ? 0 : 1;
    const rightType = right.type === "directory" ? 0 : 1;
    if (leftType !== rightType) return leftType - rightType;
  } else if (sortKey === "size") {
    const leftSize = left.size ?? -1;
    const rightSize = right.size ?? -1;
    if (leftSize !== rightSize) return leftSize - rightSize;
  } else if (sortKey === "date") {
    const leftDate = left.modified ? Date.parse(left.modified) : 0;
    const rightDate = right.modified ? Date.parse(right.modified) : 0;
    if (leftDate !== rightDate) return leftDate - rightDate;
  }
  return left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
}

function renderEntries({ listing, sortKey, ascending, filterQuery, runtimeOnly }) {
  const entries = getElement("directory-entries");
  entries.replaceChildren();
  if (listing.path !== "/") {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="kind" aria-hidden="true"><span class="kind-symbol glyph">↥</span></td><td><a href="/browse?path=${encodeURIComponent(parentPath(listing.path))}">Parent directory</a></td><td>—</td><td>—</td>`;
    entries.appendChild(row);
  }
  const filtered = listing.entries.filter((entry) => {
    const matchesQuery = entry.name.toLowerCase().includes(filterQuery);
    const hiddenArtifact = /-debuginfo|-devel|\.src\.rpm/i.test(entry.name);
    return matchesQuery && (!runtimeOnly || !hiddenArtifact);
  });
  const sorted = [...filtered].sort((left, right) => {
    const result = compareEntries(left, right, sortKey);
    return ascending ? result : -result;
  });
  sorted.forEach((entry) => addEntryRow(entries, entry));
  const files = filtered.filter((entry) => entry.type === "file");
  const totalSize = files.reduce((total, entry) => total + (entry.size || 0), 0);
  const summary = getElement("directory-summary");
  if (summary)
    summary.textContent = `Showing ${filtered.length} of ${listing.entries.length} entries · ${files.length} files · ${formatBytes(totalSize)}`;
}

export default function __moduleApi0() {
  return { parentPath, formatModified, renderEntries };
}
