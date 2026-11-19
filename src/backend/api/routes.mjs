import __moduleApi1 from "../raw-handler.mjs";
const { registerRawHandler } = __moduleApi1();

function registerApiRoutes(server, options) {
  registerRawHandler(server, "/api/*", options.requestListener);
  registerRawHandler(server, "/api", options.requestListener);
}

export default function __moduleApi0() {
  return { registerApiRoutes };
}
