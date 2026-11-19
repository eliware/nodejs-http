function registerRawHandler(server, url, requestListener) {
  server.all(url, async (request, reply) => {
    reply.hijack();
    await requestListener(request.raw, reply.raw);
  });
}

function registerWebRoutes(server, options) {
  registerRawHandler(server, "/", options.requestListener);
  registerRawHandler(server, "/*", options.requestListener);
}

export default function __moduleApi0() {
  return { registerWebRoutes };
}
