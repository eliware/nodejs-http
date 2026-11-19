import { expect, test } from "@jest/globals";
import Fastify from "fastify";
import __moduleApi0 from "../../src/backend/http.mjs";
const { registerWebRoutes } = __moduleApi0();

function requestListener(_request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("site response");
}

test("forwards the home route to the web request handler", async () => {
  const server = Fastify({ logger: false });
  registerWebRoutes(server, { requestListener });
  const response = await server.inject({ method: "GET", url: "/" });
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("site response");
  await server.close();
});

test("forwards nested asset routes to the web request handler", async () => {
  const server = Fastify({ logger: false });
  registerWebRoutes(server, { requestListener });
  const response = await server.inject({ method: "GET", url: "/assets/gluster-logo.webp" });
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("site response");
  await server.close();
});
