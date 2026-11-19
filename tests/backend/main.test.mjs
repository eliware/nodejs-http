import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/main.mjs";
const { startWebApplication } = __moduleApi0();
import { runtimeDependencies } from "../../src/backend/runtime/wiring.mjs";

test("loads runtime settings, warms the cache, and listens", async () => {
  const server = { listen: jest.fn(async () => {}) };
  const config = { host: "127.0.0.1", port: 9200 };
  const cache = new Map();
  const preloadStaticCache = jest.fn(async () => cache);
  const createApplication = jest.fn((dependencies) => ({
    server,
    config: { ...dependencies.loadConfig(), ...dependencies.config },
  }));
  const result = await startWebApplication({
    loadConfig: () => config,
    preloadStaticCache,
    createApplication,
  });
  expect(result).toBe(server);
  expect(preloadStaticCache).toHaveBeenCalledWith(config);
  expect(createApplication).toHaveBeenCalledWith(
    expect.objectContaining({ config: { ramCacheStore: cache } }),
  );
  expect(server.listen).toHaveBeenCalledWith({ host: "127.0.0.1", port: 9200 });
});

test("uses configured runtime dependencies when no dependency object is passed", async () => {
  const previous = { ...runtimeDependencies };
  const server = { listen: jest.fn(async () => {}) };
  const config = { host: "localhost", port: 9123 };
  runtimeDependencies.loadConfig = () => config;
  runtimeDependencies.preloadStaticCache = async () => new Map();
  runtimeDependencies.createApplication = () => ({ server });
  try {
    await expect(startWebApplication()).resolves.toBe(server);
    expect(server.listen).toHaveBeenCalledWith({ host: "localhost", port: 9123 });
  } finally {
    Object.assign(runtimeDependencies, previous);
  }
});
