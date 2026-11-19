import { runtimeDependencies } from "./runtime/wiring.mjs";

async function startWebApplication(dependencies = runtimeDependencies) {
  const runtime = { ...runtimeDependencies, ...dependencies };
  const config = runtime.loadConfig();
  const ramCacheStore = await runtime.preloadStaticCache(config);
  const application = runtime.createApplication({
    ...runtime,
    loadConfig: () => config,
    config: { ramCacheStore },
  });
  const { server } = application;
  await server.listen({ host: config.host, port: config.port });
  return server;
}

export default function __moduleApi0() {
  return { startWebApplication };
}
