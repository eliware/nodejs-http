import { expect, jest, test } from "@jest/globals";
import Fastify from "fastify";
import __moduleApi0 from "../../../src/backend/api/routes.mjs";
const { registerApiRoutes } = __moduleApi0();

const requestListener = jest.fn((_request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end('{"ok":true}');
});

test("forwards API requests to the application request handler", async () => {
  const server = Fastify({ logger: false });
  registerApiRoutes(server, { requestListener });
  const response = await server.inject({ method: "GET", url: "/api/v1/catalog" });
  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ ok: true });
  expect(requestListener).toHaveBeenCalledTimes(1);
  await server.close();
});
