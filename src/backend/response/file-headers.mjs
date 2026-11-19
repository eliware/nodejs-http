import __moduleApi1 from "../mime-type.mjs";
const { getContentType } = __moduleApi1();
import responseHeadersApi from "./headers.mjs";
const { baseHeaders } = responseHeadersApi();

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
  return { fileHeaders };
}
