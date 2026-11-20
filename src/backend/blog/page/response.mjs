import __moduleApiFileHeaders from "../../response/file-headers.mjs";
const { fileHeaders } = __moduleApiFileHeaders();
import __moduleApifix1 from "../../response/compression.mjs";
const { compressBody } = __moduleApifix1();

async function sendBlogPageResponse(response, request, file, body, config) {
  const buffer = Buffer.from(body);
  const headers = {
    ...fileHeaders(
      file,
      { size: buffer.length, mtime: new Date(), mtimeMs: Date.now() },
      config,
      request,
    ),
    "Cache-Control": "public, max-age=60, must-revalidate",
  };
  if (request.method === "HEAD") {
    response.writeHead(200, { ...headers, "Content-Length": buffer.length });
    response.end();
    return true;
  }
  const encoded = await compressBody(buffer, request, "text/html; charset=utf-8", config);
  response.writeHead(200, {
    ...headers,
    "Content-Length": encoded.body.length,
    ...encoded.headers,
  });
  response.end(encoded.body);
  return true;
}

export default function __moduleApi0() {
  return { sendBlogPageResponse };
}
