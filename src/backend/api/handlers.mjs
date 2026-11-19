import __moduleApifix1 from "../response.mjs";
const { sendJson } = __moduleApifix1();
import __moduleApifix2 from "../repository-directory.mjs";
const { repositoryDirectory } = __moduleApifix2();

async function handleDirectoryApi(request, response, requestPath, config) {
  if (requestPath !== "/api/v1/list") return false;
  const query = new URL(request.url || "/", "http://localhost").searchParams;
  const requestedPath = query.get("path") || "/";
  let listing;
  try {
    const normalizedPath = requestedPath.startsWith("/") ? requestedPath : `/${requestedPath}`;
    listing = await repositoryDirectory(config, normalizedPath, {
      query: query.get("q") || "",
      sort: query.get("sort") || "name",
      order: query.get("order") || "asc",
      offset: query.get("offset") || "0",
      limit: query.get("limit") || "500",
    });
  } catch {
    listing = null;
  }
  if (!listing) sendJson(response, 404, { error: "directory not found" }, config, "no-store");
  else sendJson(response, 200, listing, config);
  return true;
}

export default function __moduleApi0() {
  return { handleDirectoryApi };
}
