import { readFile } from "node:fs/promises";
import __moduleApi1 from "./mime-type.mjs";
const { getContentType } = __moduleApi1();
import __moduleApifix1 from "./response/compression.mjs";
const { compressBody } = __moduleApifix1();
import __moduleApifix2 from "./response/headers.mjs";
const { baseHeaders } = __moduleApifix2();

async function sendText(response, statusCode, message, config, headers = {}) {
  const contentType = "text/plain; charset=utf-8";
  const encoded = await compressBody(Buffer.from(message), response.req, contentType, config);
  response.writeHead(statusCode, {
    ...baseHeaders(config, response.req),
    "Content-Type": contentType,
    "Content-Length": encoded.body.length,
    ...encoded.headers,
    ...headers,
  });
  response.end(response.req?.method === "HEAD" ? undefined : encoded.body);
}

async function sendError(response, statusCode, message, config, customFile = "", headers = {}) {
  if (customFile) {
    try {
      const body = await readFile(customFile);
      response.writeHead(statusCode, {
        ...baseHeaders(config, response.req),
        "Content-Type": getContentType(customFile, config.defaultMimeType),
        "Content-Length": body.length,
        ...headers,
      });
      response.end(body);
      return;
    } catch {
      /* use the built-in response */
    }
  }
  await sendText(response, statusCode, message, config, headers);
}

async function sendJson(
  response,
  statusCode,
  value,
  config,
  cacheControl = "no-cache, must-revalidate",
) {
  const body = `${JSON.stringify(value)}\n`;
  const contentType = "application/json; charset=utf-8";
  const encoded = await compressBody(Buffer.from(body), response.req, contentType, config);
  response.writeHead(statusCode, {
    ...baseHeaders(config, response.req),
    "Cache-Control": cacheControl,
    "Content-Type": contentType,
    "Content-Length": encoded.body.length,
    ...encoded.headers,
  });
  response.end(response.req?.method === "HEAD" ? undefined : encoded.body);
}

export default function __moduleApi0() {
  return { baseHeaders, sendText, sendError, sendJson };
}
