import { promises as fs } from "node:fs";
import __moduleApi1 from "./response.mjs";
const { baseHeaders } = __moduleApi1();
import __moduleApifix1 from "./response/compression.mjs";
const { compressBody } = __moduleApifix1();
import __moduleApifix2 from "./directory/rows.mjs";
const { renderDirectoryRows } = __moduleApifix2();
import __moduleApifixPage from "./directory/page.mjs";
const { renderDirectoryHtml } = __moduleApifixPage();
import listingDataApi from "./directory/listing-data.mjs";
const { readDirectoryListingData } = listingDataApi();

async function sendDirectoryListing(
  response,
  request,
  directoryPath,
  requestPath,
  config,
  filesystem = fs,
) {
  const {
    entries: details,
    validation,
    containerValidation,
    template,
  } = await readDirectoryListingData(directoryPath, config, filesystem);
  const { html: rows, fileCount, totalBytes } = renderDirectoryRows(details, requestPath);
  const body = renderDirectoryHtml({
    template,
    requestPath,
    rows,
    fileCount,
    totalBytes,
    validation,
    containerValidation,
  });
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
  return { sendDirectoryListing };
}
