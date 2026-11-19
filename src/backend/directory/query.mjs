function sortEntries(entries, sort, order) {
  const direction = order === "desc" ? -1 : 1;
  return [...entries].sort((left, right) => {
    if (sort === "size") {
      if (left.size === undefined) return right.size === undefined ? 0 : 1;
      if (right.size === undefined) return -1;
      return direction * (left.size - right.size);
    }
    if (sort === "modified")
      return direction * String(left.modified || "").localeCompare(String(right.modified || ""));
    const directoryOrder = Number(right.type === "directory") - Number(left.type === "directory");
    if (directoryOrder) return directoryOrder;
    return direction * left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
  });
}

function parseInteger(value, fallback) {
  const text = String(value).trim();
  if (!/^-?\d+$/.test(text)) return fallback;
  const parsed = Number(text);
  return Number.isSafeInteger(parsed) ? parsed : fallback;
}

function queryDirectoryEntries(entries, options = {}) {
  const query = String(options.query || "")
    .trim()
    .toLowerCase();
  const filtered = query
    ? entries.filter((entry) => entry.name.toLowerCase().includes(query))
    : entries;
  const sorted = sortEntries(filtered, options.sort, options.order);
  const offset = Math.max(0, parseInteger(options.offset || "0", 0));
  const parsedLimit = parseInteger(options.limit || "500", 500);
  const limit = parsedLimit === 0 ? 500 : Math.min(500, Math.max(1, parsedLimit));
  return {
    entries: sorted.slice(offset, offset + limit),
    total: sorted.length,
    offset,
    limit,
    hasMore: offset + limit < sorted.length,
  };
}

export default function __moduleApi0() {
  return { queryDirectoryEntries };
}
