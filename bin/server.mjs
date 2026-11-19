import { startWebApplication } from "../src/backend/main.mjs";
import { log, registerHandlers, registerSignals } from "@eliware/common";

const server = await startWebApplication();
registerHandlers({ log });
registerSignals({ log, shutdownHook: () => server.close() });
