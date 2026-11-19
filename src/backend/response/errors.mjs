import { readFile } from "node:fs/promises";
import __moduleApi1 from "../mime-type.mjs";
const { getContentType } = __moduleApi1();
import __moduleApifix1 from "./headers.mjs";
const { baseHeaders } = __moduleApifix1();

function createErrorSender(sendText) {
  return async function sendError(
    response,
    statusCode,
    message,
    config,
    customFile = "",
    headers = {},
  ) {
    if (customFile) {
      try {
        const body = await readFile(customFile);
        response.writeHead(statusCode, {
          ...baseHeaders(config, response.req),
          "Content-Type": getContentType(customFile, config.defaultMimeType),
          "Content-Length": body.length,
          ...headers,
        });
        response.end(response.req?.method === "HEAD" ? undefined : body);
        return;
      } catch {
        /* use the built-in response */
      }
    }
    await sendText(response, statusCode, message, config, headers);
  };
}

export default function __moduleApi0() {
  return { createErrorSender };
}
