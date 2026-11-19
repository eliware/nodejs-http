import __moduleApi1 from "./mime-type.mjs";
const { getContentType } = __moduleApi1();
import { readFile } from "node:fs/promises";
import __moduleApifix1 from "./response/compression.mjs";
const { compressBody } = __moduleApifix1();

function baseHeaders(config, request) {
  const headers = {};
  if (config.securityHeaders) {
    headers["X-Content-Type-Options"] = "nosniff";
    headers["X-Frame-Options"] = "SAMEORIGIN";
    headers["Referrer-Policy"] = "no-referrer";
    if (request?.socket?.encrypted)
      headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    headers["Content-Security-Policy"] =
      "default-src 'self'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'";
  }
  if (config.corsOrigin) headers["Access-Control-Allow-Origin"] = config.corsOrigin;
  if (config.cacheControl) headers["Cache-Control"] = config.cacheControl;
  return headers;
}

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

function fileHeaders(filePath, stats, config, request) {
  const headers = {
    ...baseHeaders(config, request),
    "Content-Type": getContentType(filePath, config.defaultMimeType),
  };
  if (config.lastModified) headers["Last-Modified"] = stats.mtime.toUTCString();
  if (config.etag)
    headers.ETag = `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
  return headers;
}

export default function __moduleApi0() {
  return { baseHeaders, sendText, sendError, sendJson, fileHeaders };
}
