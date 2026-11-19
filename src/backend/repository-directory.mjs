import { promises as fs } from "node:fs";
import __moduleApi1 from "./directory/index.mjs";
const { readRepositoryIndex } = __moduleApi1();
import __moduleApifix1 from "./directory/query.mjs";
const { queryDirectoryEntries } = __moduleApifix1();
import __moduleApifix2 from "./directory/tree.mjs";
const { listFilesystemDirectories } = __moduleApifix2();
import __moduleApifix3 from "./directory/filesystem.mjs";
const { readFilesystemDirectory } = __moduleApifix3();

function directoryKey(requestPath) {
  if (!requestPath || requestPath === "/") return "/";
  return `/${requestPath.replace(/^\/+|\/+$/g, "")}/`;
}

async function repositoryDirectory(config, requestPath, options = {}, filesystem = fs) {
  const normalizedPath = directoryKey(requestPath);
  const index = await readRepositoryIndex(config, filesystem);
  if (index?.directories?.[normalizedPath]) {
    const listing = index.directories[normalizedPath];
    const page = queryDirectoryEntries(listing.entries || [], options);
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
  const page = queryDirectoryEntries(listing.entries, options);
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
  const index = await readRepositoryIndex(config, filesystem);
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
