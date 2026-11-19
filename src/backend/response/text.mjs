import __moduleApifix1 from "./compression.mjs";
const { compressBody } = __moduleApifix1();
import __moduleApifix2 from "./headers.mjs";
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

export default function __moduleApi0() {
  return { sendText };
}
