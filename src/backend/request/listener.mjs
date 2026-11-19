import __moduleApifix1 from "../response.mjs";
const { sendError, sendText } = __moduleApifix1();
import __moduleApifix2 from "../special-routes.mjs";
const { handleSpecialRequest } = __moduleApifix2();
import __moduleApifix3 from "../path-utils.mjs";
const { getRequestPath } = __moduleApifix3();
import __moduleApifix6 from "../send-file.mjs";
const { sendFile } = __moduleApifix6();
import __moduleApifix7 from "../blog/store.mjs";
const { createBlogStore } = __moduleApifix7();
import __moduleApifix8 from "./observation.mjs";
const { observeRequest } = __moduleApifix8();
import __moduleApifix9 from "./repository-files.mjs";
const { resolveRepositoryFile } = __moduleApifix9();
import { createLogger } from "@eliware/common";

function createRequestListener(config, loggerOverride) {
  const logger =
    loggerOverride ||
    createLogger({
      level: config.logLevel,
      format: config.structuredLogs ? "json" : "text",
      timestamp: config.structuredLogs,
    });
  if (!config.blogStore) config.blogStore = createBlogStore(config.blogDir);
  const allowedMethods = [config.allowGet ? "GET" : "", config.allowHead ? "HEAD" : ""].filter(
    Boolean,
  );
  return async function requestListener(request, response) {
    observeRequest(request, response, config, logger);

    if (!allowedMethods.includes(request.method || "")) {
      await sendError(response, 405, "Method Not Allowed", config, config.methodNotAllowedFile, {
        Allow: allowedMethods.join(", "),
      });
      return;
    }
    let requestPath;
    try {
      requestPath = getRequestPath(request.url || "/");
    } catch {
      sendText(response, 400, "Bad Request", config);
      return;
    }
    if (requestPath.split("/").some((part) => part === "..")) {
      sendText(response, 400, "Bad Request", config);
      return;
    }
    if (!config.allowDotfiles && requestPath.split("/").some((part) => part.startsWith("."))) {
      await sendError(response, 404, "Not Found", config, config.notFoundFile);
      return;
    }
    if (await handleSpecialRequest(request, response, requestPath, config)) return;

    const { handled, file } = await resolveRepositoryFile(request, response, requestPath, config);
    if (handled) return;
    if (!file) {
      await sendError(response, 404, "Not Found", config, config.notFoundFile);
      return;
    }

    await sendFile(response, request, file, config);
  };
}

export default function __moduleApi0() {
  return { createRequestListener };
}
