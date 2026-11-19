import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/raw-handler.mjs";
const { registerRawHandler } = __moduleApi0();

test("registers a raw request handler with Fastify", async () => {
  const request = { raw: { url: "/raw" } };
  const rawResponse = {};
  const reply = { raw: rawResponse, hijack: jest.fn() };
  const requestListener = jest.fn(async () => {});
  let registered;
  const server = {
    all(url, handler) {
      registered = { url, handler };
    },
  };
  registerRawHandler(server, "/raw", requestListener);
  await registered.handler(request, reply);
  expect(registered.url).toBe("/raw");
  expect(reply.hijack).toHaveBeenCalled();
  expect(requestListener).toHaveBeenCalledWith(request.raw, rawResponse);
});
