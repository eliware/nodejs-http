function registerRawHandler(server, url, requestListener) {
  server.all(url, async (request, reply) => {
    reply.hijack();
    await requestListener(request.raw, reply.raw);
  });
}

export default function __moduleApi0() {
  return { registerRawHandler };
}
