import { createReadStream } from "node:fs";
import { createBrotliCompress, createGzip } from "node:zlib";
import __moduleApi1 from "../response/compression.mjs";
const { chooseEncoding } = __moduleApi1();

function streamFile(
  response,
  filePath,
  stats,
  range,
  config,
  fileHeaders,
  request,
  streamFactory = createReadStream,
) {
  const headers = {
    ...fileHeaders(filePath, stats, config, request),
    ...(config.byteRanges ? { "Accept-Ranges": "bytes" } : {}),
  };
  if (config.compression) headers.Vary = "Accept-Encoding";
  if (range) {
    headers["Content-Range"] = `bytes ${range.start}-${range.end}/${stats.size}`;
    headers["Content-Length"] = range.end - range.start + 1;
    response.writeHead(206, headers);
    const stream = streamFactory(filePath, { start: range.start, end: range.end });
    stream.on("error", () => response.destroy());
    stream.pipe(response);
    return;
  }
  const encoding = chooseEncoding(request, headers["Content-Type"], stats.size, config);
  if (encoding) {
    delete headers["Content-Length"];
    headers["Content-Encoding"] = encoding;
    headers.Vary = "Accept-Encoding";
  } else headers["Content-Length"] = stats.size;
  response.writeHead(200, headers);
  const stream = streamFactory(filePath);
  stream.on("error", () => response.destroy());
  if (encoding === "br") stream.pipe(createBrotliCompress()).pipe(response);
  else if (encoding === "gzip") stream.pipe(createGzip()).pipe(response);
  else stream.pipe(response);
}

export default function __moduleApi0() {
  return { streamFile };
}
