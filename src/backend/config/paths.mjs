import path from "node:path";

const DEFAULT_PUBLIC_DIR = path.resolve(process.cwd(), "public");

function envValue(env, key, fallback) {
  const value = env[key];
  return typeof value === "string" ? value : fallback;
}

function deriveConfigPaths(env) {
  const publicDir = path.resolve(envValue(env, "PUBLIC_DIR", DEFAULT_PUBLIC_DIR));
  return {
    publicDir,
    blogDir: path.resolve(envValue(env, "BLOG_DIR", path.join(publicDir, "content", "blogs"))),
    staticDir: path.resolve(envValue(env, "STATIC_DIR", path.join(process.cwd(), "site"))),
    staticIndexFile: envValue(env, "STATIC_INDEX_FILE", "index.html"),
    indexFile: envValue(env, "INDEX_FILE", "index.html"),
    directoryTemplate: envValue(
      env,
      "DIRECTORY_TEMPLATE",
      "/srv/repository/directory-listing.html",
    ),
    notFoundFile: envValue(env, "NOT_FOUND_FILE", "") || "",
    methodNotAllowedFile: envValue(env, "METHOD_NOT_ALLOWED_FILE", "") || "",
  };
}

export default function __moduleApi0() {
  return { DEFAULT_PUBLIC_DIR, deriveConfigPaths };
}
