import __moduleApi1 from "./boolean.mjs";
const { parseBoolean } = __moduleApi1();
import __moduleApifix1 from "./positive-int.mjs";
const { parsePositiveInt } = __moduleApifix1();

const DEFAULT_PORT = 7100;
const DEFAULT_HOST = "0.0.0.0";

function envValue(env, key, fallback = "") {
  const value = env[key];
  return typeof value === "string" ? value : fallback;
}

function loadHttpConfig(env) {
  const directoryRedirect = envValue(env, "DIRECTORY_REDIRECT");
  return {
    host: envValue(env, "HOST", DEFAULT_HOST),
    port: parsePositiveInt(envValue(env, "PORT"), DEFAULT_PORT),
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
    compression: parseBoolean(envValue(env, "COMPRESSION", "true"), true),
    compressionMinBytes: parsePositiveInt(envValue(env, "COMPRESSION_MIN_BYTES"), 256),
  };
}

export default function __moduleApi0() {
  return { DEFAULT_PORT, DEFAULT_HOST, loadHttpConfig };
}
