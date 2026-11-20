import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "../path-utils.mjs";
const { resolvePublicPath } = __moduleApi1();
import __moduleApifix1 from "./metadata.mjs";
const { readJson } = __moduleApifix1();
import directoryEntriesApi from "./entries.mjs";
const { readDirectoryEntries } = directoryEntriesApi();

async function readFilesystemDirectory(config, requestPath, filesystem = fs) {
  const filePath =
    requestPath === "/"
      ? path.resolve(config.publicDir)
      : resolvePublicPath(config.publicDir, requestPath);
  if (!filePath) return null;
  const publicRoot = await filesystem.realpath(config.publicDir);
  const resolvedPath = await filesystem.realpath(filePath);
  const normalizedRoot = path.resolve(publicRoot);
  if (resolvedPath !== normalizedRoot && !resolvedPath.startsWith(`${normalizedRoot}${path.sep}`))
    return null;
  const stats = await filesystem.stat(resolvedPath);
  if (!stats.isDirectory()) return null;
  const entries = await readDirectoryEntries(
    filesystem,
    resolvedPath,
    normalizedRoot,
    requestPath,
    config,
  );
  return {
    entries,
    validation: await readJson(resolvedPath, "validation.json", filesystem),
    container_validation: await readJson(resolvedPath, "container-validation.json", filesystem),
  };
}

export default function __moduleApi0() {
  return { readFilesystemDirectory };
}
