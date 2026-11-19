import __moduleApi1 from "../file-access.mjs";
const { staticFileExists } = __moduleApi1();
import __moduleApifix1 from "../response/file-headers.mjs";
const { fileHeaders } = __moduleApifix1();
import __moduleApifix2 from "../response/compression.mjs";
const { compressBody } = __moduleApifix2();
import { promises as fs } from "node:fs";
import { APP_VERSION } from "../app-version.mjs";
import __moduleApifix3 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApifix3();
import __moduleApifix4 from "../directory/presentation.mjs";
const { copyrightYear } = __moduleApifix4();

async function serveStaticFile(response, request, requestPath, config) {
  const file = await staticFileExists(config.staticDir, requestPath, config);
  if (!file) return false;
  const headers = {
    ...fileHeaders(file.path, file.stats, config, request),
    "Cache-Control": requestPath.startsWith("/web/")
      ? "public, max-age=60, must-revalidate"
      : requestPath.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=60",
  };
  let body = await fs.readFile(file.path);
  if (file.path.endsWith(".html"))
    body = Buffer.from(
      body
        .toString("utf8")
        .replaceAll("__HOST_ID__", servingHostId())
        .replaceAll("__COPYRIGHT_YEAR__", copyrightYear())
        .replaceAll("__APP_VERSION__", process.env.APP_VERSION || APP_VERSION)
        .replaceAll("__ASSET_VERSION__", process.env.APP_VERSION || APP_VERSION),
    );
  const encoded = await compressBody(body, request, headers["Content-Type"], config);
  if (request.method === "HEAD") {
    response.writeHead(200, {
      ...headers,
      "Content-Length": encoded.body.length,
      ...encoded.headers,
    });
    response.end();
    return true;
  }
  response.writeHead(200, {
    ...headers,
    "Content-Length": encoded.body.length,
    ...encoded.headers,
  });
  response.end(encoded.body);
  return true;
}

export default function __moduleApi0() {
  return { serveStaticFile };
}
