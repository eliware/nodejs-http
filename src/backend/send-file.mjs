import __moduleApi1 from "./range-utils.mjs";
const { parseByteRange } = __moduleApi1();
import __moduleApifix1 from "./response.mjs";
const { fileHeaders, sendText } = __moduleApifix1();
import __moduleApifix2 from "./response/compression.mjs";
const { compressBody } = __moduleApifix2();
import __moduleApifix3 from "./static/stream.mjs";
const { streamFile } = __moduleApifix3();

async function sendFile(response, request, file, config) {
  const { path: filePath, stats } = file;
  const rangeHeader = config.byteRanges ? request.headers?.range : null;
  const range = rangeHeader ? parseByteRange(rangeHeader, stats.size) : null;
  if (rangeHeader && !range) {
    sendText(response, 416, "Range Not Satisfiable", config, {
      "Content-Range": `bytes */${stats.size}`,
      "Accept-Ranges": "bytes",
    });
    return;
  }
  const headers = {
    ...fileHeaders(filePath, stats, config, request),
    ...(config.byteRanges ? { "Accept-Ranges": "bytes" } : {}),
  };
  if (request.method === "HEAD") {
    if (range) {
      headers["Content-Range"] = `bytes ${range.start}-${range.end}/${stats.size}`;
      headers["Content-Length"] = range.end - range.start + 1;
      response.writeHead(206, headers);
    } else {
      headers["Content-Length"] = stats.size;
      response.writeHead(200, headers);
    }
    response.end();
    return;
  }
  if (file.body && !range) {
    const encoded = await compressBody(file.body, request, headers["Content-Type"], config);
    response.writeHead(200, {
      ...headers,
      "Content-Length": encoded.body.length,
      ...encoded.headers,
    });
    response.end(encoded.body);
    return;
  }
  streamFile(response, filePath, stats, range, config, fileHeaders, request);
}

export default function __moduleApi0() {
  return { sendFile };
}
