import Fastify from "fastify";

function createWebServer() {
  return Fastify({
    logger: false,
    ajv: { customOptions: { removeAdditional: false } },
  });
}

export default function __moduleApi0() {
  return { createWebServer };
}
