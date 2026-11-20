import __moduleApi1 from "../response.mjs";
const { baseHeaders } = __moduleApi1();
import compressionApi from "../response/compression.mjs";
const { compressBody } = compressionApi();

async function sendDirectoryResponse(response, request, body, config) {
  const contentType = "text/html; charset=utf-8";
  const encoded = await compressBody(Buffer.from(body), request, contentType, config);
  response.writeHead(200, {
    ...baseHeaders(config, request),
    "Content-Type": contentType,
    "Content-Length": encoded.body.length,
    ...encoded.headers,
  });
  response.end(request.method === "HEAD" ? undefined : encoded.body);
}

export default function __moduleApi0() {
  return { sendDirectoryResponse };
}
