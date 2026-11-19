const origin = location.origin;
const jsonCache = new Map();

async function getJson(path) {
  if (jsonCache.has(path)) return jsonCache.get(path);
  const request = fetch(`${origin}${path}`, { cache: "force-cache" }).then(async (response) => {
    if (!response.ok) throw new Error(`request failed: ${response.status}`);
    return response.json();
  });
  jsonCache.set(path, request);
  try {
    return await request;
  } catch (error) {
    jsonCache.delete(path);
    throw error;
  }
}

const fetchCatalog = () => getJson("/api/v1/catalog");
const fetchDirectory = (path) => getJson(`/api/v1/list?path=${encodeURIComponent(path)}`);
const fetchRepositoryIndex = () => getJson("/metadata/repository-index.json");
const fetchReleaseManifest = () => getJson("/metadata/release-manifest.json");

export default function __moduleApi0() {
  return { fetchCatalog, fetchDirectory, fetchRepositoryIndex, fetchReleaseManifest, origin };
}
