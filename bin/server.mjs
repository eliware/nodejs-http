import mainApi from "../src/backend/main.mjs";
import { log, registerHandlers, registerSignals } from "@eliware/common";

const { startWebApplication } = mainApi();
const server = await startWebApplication();
registerHandlers({ log });
registerSignals({ log, shutdownHook: () => server.close() });
