import path from "node:path";
import { promises as fs } from "node:fs";

async function resolveSafeFile(root, filePath, allowSymlinks, filesystem) {
  const lexicalRoot = path.resolve(root);
  const candidate = path.resolve(filePath);
  const relative = path.relative(lexicalRoot, candidate);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`)) return null;
  if (!allowSymlinks) {
    const rootDetails = await filesystem.lstat(lexicalRoot);
    if (rootDetails.isSymbolicLink?.()) return null;
  }
  const resolvedRoot = await filesystem.realpath(root);
  const resolvedFilePath = await filesystem.realpath(candidate);
  if (!resolvedFilePath.startsWith(path.resolve(resolvedRoot) + path.sep)) return null;
  if (!allowSymlinks) {
    let current = path.resolve(resolvedRoot);
    for (const segment of relative.split(path.sep)) {
      current = path.join(current, segment);
      const details = await filesystem.lstat(current);
      if (details.isSymbolicLink?.()) return null;
    }
  }
  return resolvedFilePath;
}

async function fileExists(filePath, config, filesystem = fs) {
  try {
    const resolvedFilePath = await resolveSafeFile(
      config.publicDir,
      filePath,
      config.allowSymlinks,
      filesystem,
    );
    if (!resolvedFilePath) return null;
    const cached = config.ramCacheStore?.get(resolvedFilePath);
    if (cached) return { path: resolvedFilePath, stats: cached.stats, body: cached.body };
    const stats = await filesystem.stat(resolvedFilePath);
    return stats.isFile() ? { path: resolvedFilePath, stats } : null;
  } catch {
    return null;
  }
}

async function staticFileExists(root, requestPath, config, filesystem = fs) {
  try {
    const candidate = path.resolve(root, `.${requestPath === "/" ? "/index.html" : requestPath}`);
    const filePath = await resolveSafeFile(root, candidate, config.allowSymlinks, filesystem);
    if (!filePath) return null;
    const stats = await filesystem.stat(filePath);
    return stats.isFile() ? { path: filePath, stats } : null;
  } catch {
    return null;
  }
}

export default function __moduleApi0() {
  return { fileExists, staticFileExists };
}
