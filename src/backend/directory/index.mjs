import path from "node:path";
import metadataVersionApi from "../metadata/version.mjs";
const { assertMetadataVersion } = metadataVersionApi();

let cachedIndex = null;
let cachedIndexKey = "";

async function readRepositoryIndex(config, filesystem) {
  const indexPath = path.join(config.publicDir, "metadata/repository-index.json");
  try {
    const stats = await filesystem.stat(indexPath);
    const stamp = `${stats.mtimeMs}:${stats.size}`;
    const cacheKey = `${indexPath}:${stamp}`;
    if (cachedIndex && cachedIndexKey === cacheKey) return cachedIndex;
    cachedIndex = assertMetadataVersion(
      JSON.parse(await filesystem.readFile(indexPath, "utf8")),
      "repository-index.json",
    );
    cachedIndexKey = cacheKey;
    return cachedIndex;
  } catch {
    cachedIndex = null;
    cachedIndexKey = "";
    return null;
  }
}

export default function __moduleApi0() {
  return { readRepositoryIndex };
}
