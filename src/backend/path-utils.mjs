import path from "node:path";

function getRequestPath(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  return decodeURIComponent(url.pathname);
}

function resolvePublicPath(publicDir, requestPath) {
  if (typeof requestPath !== "string" || requestPath.includes("\\")) return null;
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const resolvedPath = path.resolve(publicDir, `.${normalizedPath}`);
  const relativePath = path.relative(path.resolve(publicDir), resolvedPath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  )
    return null;

  return resolvedPath;
}

export default function __moduleApi0() {
  return { getRequestPath, resolvePublicPath };
}
