import __moduleApi1 from "./range-utils.mjs";
const { parseByteRange } = __moduleApi1();
import __moduleApifix1 from "./response.mjs";
const { sendText } = __moduleApifix1();
import __moduleApiFileHeaders from "./response/file-headers.mjs";
const { fileHeaders } = __moduleApiFileHeaders();
import __moduleApifix2 from "./response/compression.mjs";
const { chooseEncoding, compressBody } = __moduleApifix2();
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
      if (file.body) {
        const encoded = await compressBody(file.body, request, headers["Content-Type"], config);
        headers["Content-Length"] = encoded.body.length;
        Object.assign(headers, encoded.headers);
      } else {
        const encoding = chooseEncoding(request, headers["Content-Type"], stats.size, config);
        if (encoding) {
          headers["Content-Encoding"] = encoding;
          headers.Vary = "Accept-Encoding";
        } else headers["Content-Length"] = stats.size;
      }
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
