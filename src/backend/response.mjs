import __moduleApifix1 from "./response/compression.mjs";
const { compressBody } = __moduleApifix1();
import __moduleApifix2 from "./response/headers.mjs";
const { baseHeaders } = __moduleApifix2();
import __moduleApifix3 from "./response/errors.mjs";
const { createErrorSender } = __moduleApifix3();

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

const sendError = createErrorSender(sendText);

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
