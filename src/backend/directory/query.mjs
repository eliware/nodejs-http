function sortEntries(entries, sort, order) {
  const direction = order === "desc" ? -1 : 1;
  return [...entries].sort((left, right) => {
    if (sort === "size") return direction * ((left.size ?? -1) - (right.size ?? -1));
    if (sort === "modified")
      return direction * String(left.modified || "").localeCompare(String(right.modified || ""));
    const directoryOrder = Number(right.type === "directory") - Number(left.type === "directory");
    if (directoryOrder) return directoryOrder;
    return direction * left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
  });
}

function queryDirectoryEntries(entries, options = {}) {
  const query = String(options.query || "")
    .trim()
    .toLowerCase();
  const filtered = query
    ? entries.filter((entry) => entry.name.toLowerCase().includes(query))
    : entries;
  const sorted = sortEntries(filtered, options.sort, options.order);
  const offset = Math.max(0, Number.parseInt(options.offset || "0", 10) || 0);
  const limit = Math.min(500, Math.max(1, Number.parseInt(options.limit || "500", 10) || 500));
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
