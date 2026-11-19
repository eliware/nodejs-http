import __moduleApi1 from "./raw-handler.mjs";
const { registerRawHandler } = __moduleApi1();

function registerWebRoutes(server, options) {
  registerRawHandler(server, "/", options.requestListener);
  registerRawHandler(server, "/*", options.requestListener);
}

export default function __moduleApi0() {
  return { registerWebRoutes };
}
