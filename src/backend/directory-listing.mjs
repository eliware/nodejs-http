import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "./response.mjs";
const { baseHeaders } = __moduleApi1();
import __moduleApifix1 from "./response/compression.mjs";
const { compressBody } = __moduleApifix1();
import __moduleApifix2 from "./directory/listing.mjs";
const { renderDirectoryHtml, renderDirectoryRows } = __moduleApifix2();

async function readJson(directoryPath, name, filesystem) {
  try {
    return JSON.parse(await filesystem.readFile(path.join(directoryPath, name), "utf8"));
  } catch {
    return null;
  }
}

async function sendDirectoryListing(
  response,
  request,
  directoryPath,
  requestPath,
  config,
  filesystem = fs,
) {
  const entries = (await filesystem.readdir(directoryPath, { withFileTypes: true }))
    .filter((entry) => config.allowDotfiles || !entry.name.startsWith("."))
    .sort(
      (left, right) =>
        Number(right.isDirectory()) - Number(left.isDirectory()) ||
        left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
    );
  const details = await Promise.all(
    entries.map(async (entry) => {
      try {
        return {
          name: entry.name,
          isDirectory: entry.isDirectory(),
          stats: await filesystem.stat(path.join(directoryPath, entry.name)),
        };
      } catch {
        return { name: entry.name, isDirectory: entry.isDirectory(), stats: null };
      }
    }),
  );
  const { html: rows, fileCount, totalBytes } = renderDirectoryRows(details, requestPath);
  const [validation, containerValidation, template] = await Promise.all([
    readJson(directoryPath, "validation.json", filesystem),
    readJson(directoryPath, "container-validation.json", filesystem),
    filesystem.readFile(config.directoryTemplate, "utf8").catch(() => null),
  ]);
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
