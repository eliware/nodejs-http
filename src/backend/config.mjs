import __moduleApi1 from "./config/boolean.mjs";
const { parseBoolean } = __moduleApi1();
import __moduleApifix1 from "./config/positive-int.mjs";
const { parsePositiveInt } = __moduleApifix1();
import configPathsApi from "./config/paths.mjs";
const { DEFAULT_PUBLIC_DIR, deriveConfigPaths } = configPathsApi();

const DEFAULT_PORT = 7100;
const DEFAULT_HOST = "0.0.0.0";
function envValue(env, key, fallback = "") {
  const value = env[key];
  return typeof value === "string" ? value : fallback;
}

function loadConfig(env = process.env) {
  const paths = deriveConfigPaths(env);
  const host = envValue(env, "HOST", DEFAULT_HOST);
  const portText = envValue(env, "PORT");
  const directoryRedirect = envValue(env, "DIRECTORY_REDIRECT");

  return {
    host,
    port: parsePositiveInt(portText, DEFAULT_PORT),
    ...paths,
    directoryIndex: parseBoolean(envValue(env, "DIRECTORY_INDEX"), true),
    directoryListing: parseBoolean(envValue(env, "DIRECTORY_LISTING", "true"), true),
    directoryRedirect: ["301", "308"].includes(directoryRedirect) ? Number(directoryRedirect) : 301,
    allowDotfiles: parseBoolean(envValue(env, "ALLOW_DOTFILES", "false"), false),
    allowSymlinks: parseBoolean(envValue(env, "ALLOW_SYMLINKS", "false"), false),
    securityHeaders: parseBoolean(envValue(env, "SECURITY_HEADERS", "true"), true),
    corsOrigin: envValue(env, "CORS_ORIGIN", "") || "",
    allowGet: parseBoolean(envValue(env, "ALLOW_GET", "true"), true),
    allowHead: parseBoolean(envValue(env, "ALLOW_HEAD", "true"), true),
    byteRanges: parseBoolean(envValue(env, "BYTE_RANGES", "true"), true),
    etag: parseBoolean(envValue(env, "ETAG", "true"), true),
    lastModified: parseBoolean(envValue(env, "LAST_MODIFIED", "true"), true),
    cacheControl: envValue(env, "CACHE_CONTROL", "") || "",
    defaultMimeType:
      envValue(env, "DEFAULT_MIME_TYPE", "application/octet-stream") || "application/octet-stream",
    accessLog: parseBoolean(envValue(env, "ACCESS_LOG", "true"), true),
    structuredLogs: parseBoolean(envValue(env, "STRUCTURED_LOGS", "true"), true),
    logLevel: envValue(env, "LOG_LEVEL", "info") || "info",
    shutdownTimeout: parsePositiveInt(envValue(env, "SHUTDOWN_TIMEOUT"), 5000),
    requestTimeout: parsePositiveInt(envValue(env, "REQUEST_TIMEOUT"), 30000),
    headersTimeout: parsePositiveInt(envValue(env, "HEADERS_TIMEOUT"), 60000),
    keepAliveTimeout: parsePositiveInt(envValue(env, "KEEP_ALIVE_TIMEOUT"), 5000),
    ramCache: parseBoolean(envValue(env, "RAM_CACHE", "false"), false),
    ramCachePaths: envValue(
      env,
      "RAM_CACHE_PATHS",
      "/index.html,/directory-listing.html,/web/app.css,/web/app.js,/assets/favicon.ico,/assets/eliware-brand.svg",
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    ramCacheMaxBytes: parsePositiveInt(envValue(env, "RAM_CACHE_MAX_BYTES"), 10 * 1024 * 1024),
    compression: parseBoolean(envValue(env, "COMPRESSION", "true"), true),
    compressionMinBytes: parsePositiveInt(envValue(env, "COMPRESSION_MIN_BYTES"), 256),
  };
}

export default function __moduleApi0() {
  return {
    DEFAULT_PORT,
    DEFAULT_HOST,
    DEFAULT_PUBLIC_DIR,
    loadConfig,
  };
}
