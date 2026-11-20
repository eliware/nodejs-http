import { promises as fs } from "node:fs";
import directoryResponseApi from "./directory/response.mjs";
const { sendDirectoryResponse } = directoryResponseApi();
import __moduleApifix2 from "./directory/rows.mjs";
const { renderDirectoryRows } = __moduleApifix2();
import __moduleApifixPage from "./directory/page.mjs";
const { renderDirectoryHtml } = __moduleApifixPage();
import listingDataApi from "./directory/listing-data.mjs";
const { readDirectoryListingData } = listingDataApi();
import pageMetadataApi from "./directory/page-metadata.mjs";
const { pageMetadata } = pageMetadataApi();
import directoryTotalsApi from "./directory/totals.mjs";
const { summarizeDirectoryTotals } = directoryTotalsApi();

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
  const rows = renderDirectoryRows(details, requestPath);
  const { fileCount, totalBytes } = summarizeDirectoryTotals(details);
  const body = renderDirectoryHtml({
    template,
    requestPath,
    rows,
    fileCount,
    totalBytes,
    validation,
    containerValidation,
    metadata: pageMetadata(),
  });
  await sendDirectoryResponse(response, request, body, config);
}

export default function __moduleApi0() {
  return { sendDirectoryListing };
}
