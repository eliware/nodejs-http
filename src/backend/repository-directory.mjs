import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "./metadata/version.mjs";
const { assertMetadataVersion } = __moduleApi1();
import __moduleApifix1 from "./directory/filesystem.mjs";
const { readFilesystemDirectory } = __moduleApifix1();
import __moduleApifix2 from "./directory/tree.mjs";
const { listFilesystemDirectories } = __moduleApifix2();

let cachedIndex = null;
let cachedIndexStamp = "";

function directoryKey(requestPath) {
  if (!requestPath || requestPath === "/") return "/";
  return `/${requestPath.replace(/^\/+|\/+$/g, "")}/`;
}

async function readIndex(config, filesystem) {
  const indexPath = path.join(config.publicDir, "metadata/repository-index.json");
  try {
    const stats = await filesystem.stat(indexPath);
    const stamp = `${stats.mtimeMs}:${stats.size}`;
    if (cachedIndex && cachedIndexStamp === stamp) return cachedIndex;
    cachedIndex = assertMetadataVersion(
      JSON.parse(await filesystem.readFile(indexPath, "utf8")),
      "repository-index.json",
    );
    cachedIndexStamp = stamp;
    return cachedIndex;
  } catch {
    cachedIndex = null;
    cachedIndexStamp = "";
    return null;
  }
}

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

function paginate(entries, options) {
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

async function repositoryDirectory(config, requestPath, options = {}, filesystem = fs) {
  const normalizedPath = directoryKey(requestPath);
  const index = await readIndex(config, filesystem);
  if (index?.directories?.[normalizedPath]) {
    const listing = index.directories[normalizedPath];
    const page = paginate(listing.entries || [], options);
    return {
      path: normalizedPath,
      total: page.total,
      offset: page.offset,
      limit: page.limit,
      hasMore: page.hasMore,
      entries: page.entries,
      validation: listing.validation || null,
      container_validation: listing.container_validation || null,
    };
  }

  const listing = await readFilesystemDirectory(config, normalizedPath, filesystem);
  if (!listing) return null;
  const page = paginate(listing.entries, options);
  return {
    path: normalizedPath,
    total: page.total,
    offset: page.offset,
    limit: page.limit,
    hasMore: page.hasMore,
    validation: listing.validation,
    container_validation: listing.container_validation,
    entries: page.entries,
  };
}

async function repositoryDirectories(config, filesystem = fs) {
  const index = await readIndex(config, filesystem);
  if (index?.directories) {
    return Object.keys(index.directories)
      .map((value) => directoryKey(value))
      .sort();
  }

  return listFilesystemDirectories(config, filesystem);
}

export default function __moduleApi0() {
  return { repositoryDirectory, repositoryDirectories };
}
