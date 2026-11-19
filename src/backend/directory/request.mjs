import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "../directory-listing.mjs";
const { sendDirectoryListing } = __moduleApi1();
import __moduleApifix1 from "../file-access.mjs";
const { fileExists } = __moduleApifix1();
import __moduleApifix2 from "../response.mjs";
const { sendError, baseHeaders } = __moduleApifix2();

async function resolveDirectoryRequest(
  request,
  response,
  filePath,
  requestPath,
  config,
  filesystem = fs,
) {
  try {
    const publicRootDetails = await filesystem.lstat(config.publicDir);
    if (publicRootDetails.isSymbolicLink?.() && !config.allowSymlinks) {
      await sendError(response, 404, "Not Found", config, config.notFoundFile);
      return { handled: true };
    }
    const resolvedPublicDir = await filesystem.realpath(config.publicDir);
    const resolvedPath = await filesystem.realpath(filePath);
    const publicRoot = path.resolve(resolvedPublicDir);
    if (resolvedPath !== publicRoot && !resolvedPath.startsWith(publicRoot + path.sep)) {
      await sendError(response, 404, "Not Found", config, config.notFoundFile);
      return { handled: true };
    }
    const stats = await filesystem.stat(resolvedPath);
    if (!stats.isDirectory()) return { handled: false, file: null };
    if (requestPath !== "/" && !requestPath.endsWith("/")) {
      const requestUrl = new URL(request.url, "http://localhost");
      response.writeHead(config.directoryRedirect, {
        ...baseHeaders(config, request),
        Location: `${requestUrl.pathname}/${requestUrl.search}`,
      });
      response.end();
      return { handled: true };
    }
    const indexPath = path.join(resolvedPath, config.indexFile);
    const file = await fileExists(indexPath, config);
    if (file) return { handled: false, file };
    if (config.directoryListing) {
      await sendDirectoryListing(response, request, resolvedPath, requestPath, config);
      return { handled: true };
    }
  } catch {
    /* missing or inaccessible path */
  }
  return { handled: false, file: null };
}

export default function __moduleApi0() {
  return { resolveDirectoryRequest };
}
