import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "../response.mjs";
const { sendJson } = __moduleApi1();
import __moduleApifix1 from "./version.mjs";
const { assertMetadataVersion } = __moduleApifix1();

async function handleCatalogRoute(response, requestPath, config) {
  if (requestPath !== "/api/v1/catalog") return false;
  try {
    sendJson(
      response,
      200,
      assertMetadataVersion(
        JSON.parse(await fs.readFile(path.join(config.publicDir, "metadata/catalog.json"), "utf8")),
        "catalog.json",
      ),
      config,
    );
  } catch {
    sendJson(response, 503, { error: "catalog unavailable" }, config, "no-store");
  }
  return true;
}

export default function __moduleApi0() {
  return { handleCatalogRoute };
}
