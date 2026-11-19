import __moduleApi1 from "./api/routes.mjs";
const { registerApiRoutes } = __moduleApi1();
import __moduleApifix1 from "./http.mjs";
const { registerWebRoutes } = __moduleApifix1();
import __moduleApifix2 from "./request-listener.mjs";
const { createRequestListener } = __moduleApifix2();
import __moduleApifix3 from "./server.mjs";
const { createWebServer } = __moduleApifix3();
import __moduleApifix4 from "./config.mjs";
const { loadConfig } = __moduleApifix4();

function createApplication(dependencies = {}) {
  const loadedConfig = (dependencies.loadConfig || loadConfig)();
  const config = { ...loadedConfig, ...dependencies.config };
  const server = (dependencies.createServer || createWebServer)();
  const requestListener = (dependencies.createRequestListener || createRequestListener)(config);
  (dependencies.registerApiRoutes || registerApiRoutes)(server, { requestListener });
  (dependencies.registerWebRoutes || registerWebRoutes)(server, { requestListener });
  return { server, config };
}

export default function __moduleApi0() {
  return { createApplication };
}
