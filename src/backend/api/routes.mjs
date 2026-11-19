function registerRawHandler(server, url, requestListener) {
  server.all(url, async (request, reply) => {
    reply.hijack();
    await requestListener(request.raw, reply.raw);
  });
}

function registerApiRoutes(server, options) {
  registerRawHandler(server, "/api/*", options.requestListener);
  registerRawHandler(server, "/api", options.requestListener);
}

export default function __moduleApi0() {
  return { registerApiRoutes };
}
