import { PassThrough } from "node:stream";

export function createHttpResponse(method = "GET", headers = {}) {
  const response = new PassThrough();
  response.req = { method, headers };
  response.statusCode = null;
  response.headers = {};
  response.writeHead = (statusCode, responseHeaders = {}) => {
    response.statusCode = statusCode;
    response.headers = responseHeaders;
  };
  return response;
}

export async function readHttpBody(response) {
  const chunks = [];
  response.on("data", (chunk) => chunks.push(chunk));
  if (!response.readableEnded) await new Promise((resolve) => response.on("end", resolve));
  return Buffer.concat(chunks);
}
