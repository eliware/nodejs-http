import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/app.mjs";
const { createApplication } = __moduleApi0();

test("wires API and web routes onto a configured server", () => {
  const server = {};
  const requestListener = jest.fn();
  const createServer = jest.fn(() => server);
  const createRequestListener = jest.fn(() => requestListener);
  const registerApiRoutes = jest.fn();
  const registerWebRoutes = jest.fn();
  const config = { host: "127.0.0.1", port: 9001 };
  const result = createApplication({
    loadConfig: () => config,
    createServer,
    createRequestListener,
    registerApiRoutes,
    registerWebRoutes,
  });

  expect(result).toEqual({ server, config });
  expect(createRequestListener).toHaveBeenCalledWith(config);
  expect(registerApiRoutes).toHaveBeenCalledWith(server, { requestListener });
  expect(registerWebRoutes).toHaveBeenCalledWith(server, { requestListener });
});

test("uses the default config, server, listener, and route registrars", async () => {
  const application = createApplication();
  expect(application.config.publicDir).toBeDefined();
  await application.server.ready();
  expect(typeof application.server.listen).toBe("function");
});
