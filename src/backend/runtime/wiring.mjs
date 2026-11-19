import __moduleApi0 from "../app.mjs";
const { createApplication } = __moduleApi0();
import __moduleApifix1 from "../config.mjs";
const { loadConfig } = __moduleApifix1();
import __moduleApifix2 from "../static/file-server.mjs";
const { preloadStaticCache } = __moduleApifix2();

export const runtimeDependencies = {
  createApplication,
  loadConfig,
  preloadStaticCache,
};
