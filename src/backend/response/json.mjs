import __moduleApifix1 from "./compression.mjs";
const { compressBody } = __moduleApifix1();
import __moduleApifix2 from "./headers.mjs";
const { baseHeaders } = __moduleApifix2();

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
  return { sendJson };
}
