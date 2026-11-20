import __moduleApi1 from "./config/boolean.mjs";
const { parseBoolean } = __moduleApi1();
import __moduleApifix1 from "./config/positive-int.mjs";
const { parsePositiveInt } = __moduleApifix1();
import configPathsApi from "./config/paths.mjs";
const { DEFAULT_PUBLIC_DIR, deriveConfigPaths } = configPathsApi();
import httpConfigApi from "./config/http.mjs";
const { DEFAULT_PORT, DEFAULT_HOST, loadHttpConfig } = httpConfigApi();
function envValue(env, key, fallback = "") {
  const value = env[key];
  return typeof value === "string" ? value : fallback;
}

function loadConfig(env = process.env) {
  const paths = deriveConfigPaths(env);
  return {
    ...loadHttpConfig(env),
    ...paths,
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
