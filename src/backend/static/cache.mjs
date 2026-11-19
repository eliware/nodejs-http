import path from "node:path";
import { promises as fs } from "node:fs";

async function preloadStaticCache(config, filesystem = fs) {
  const cache = new Map();
  if (!config.ramCache) return cache;
  let totalBytes = 0;
  const publicRoot = await filesystem.realpath(config.publicDir);
  for (const requestedPath of config.ramCachePaths) {
    const candidate = path.resolve(
      config.publicDir,
      `.${requestedPath.startsWith("/") ? requestedPath : `/${requestedPath}`}`,
    );
    try {
      const filePath = await filesystem.realpath(candidate);
      if (!filePath.startsWith(`${publicRoot}${path.sep}`)) continue;
      const stats = await filesystem.stat(filePath);
      if (!stats.isFile() || totalBytes + stats.size > config.ramCacheMaxBytes) continue;
      cache.set(filePath, { body: await filesystem.readFile(filePath), stats });
      totalBytes += stats.size;
    } catch {
      /* Optional assets may not exist. */
    }
  }
  return cache;
}

export default function __moduleApi0() {
  return { preloadStaticCache };
}
