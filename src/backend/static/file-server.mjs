import __moduleApi1 from "../config.mjs";
const { loadConfig } = __moduleApi1();
import __moduleApifix1 from "./cache.mjs";
const { preloadStaticCache } = __moduleApifix1();
import __moduleApifix2 from "../request/listener.mjs";
const { createRequestListener } = __moduleApifix2();

function createStaticRequestListener(options) {
  const config = typeof options === "string" ? { ...loadConfig(), publicDir: options } : options;
  return createRequestListener(config);
}

export default function __moduleApi0() {
  return { preloadStaticCache, createStaticRequestListener };
}
