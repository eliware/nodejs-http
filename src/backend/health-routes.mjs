import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "./response.mjs";
const { sendJson } = __moduleApi1();
import __moduleApifix1 from "./metrics.mjs";
const { renderMetrics } = __moduleApifix1();
import __moduleApifix2 from "./metadata/version.mjs";
const { assertMetadataVersion } = __moduleApifix2();

async function handleHealthRoute(request, response, requestPath, config) {
  if (requestPath === "/health" || requestPath === "/healthz") {
    sendJson(response, 200, { status: "ok" }, config, "no-store");
    return true;
  }
  if (requestPath === "/metrics") {
    response.writeHead(200, {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : renderMetrics());
    return true;
  }
  if (requestPath !== "/ready" && requestPath !== "/readyz") return false;
  return checkReadiness(response, config);
}

async function checkReadiness(response, config) {
  let catalog = false;
  try {
    assertMetadataVersion(
      JSON.parse(await fs.readFile(path.join(config.publicDir, "metadata/catalog.json"), "utf8")),
      "catalog.json",
    );
    catalog = true;
  } catch {}
  let index = false;
  try {
    assertMetadataVersion(
      JSON.parse(
        await fs.readFile(path.join(config.publicDir, "metadata/repository-index.json"), "utf8"),
      ),
      "repository-index.json",
    );
    index = true;
  } catch {}
  let active = null;
  try {
    active = assertMetadataVersion(
      JSON.parse(
        await fs.readFile(path.join(config.publicDir, "metadata/active-generation.json"), "utf8"),
      ),
      "active-generation.json",
    );
    const generation = assertMetadataVersion(
      JSON.parse(
        await fs.readFile(
          path.join(config.publicDir, ".generations", active.generation, "generation.json"),
          "utf8",
        ),
      ),
      "generation.json",
    );
    if (generation.generation !== active.generation) throw new Error("generation mismatch");
  } catch {
    active = null;
  }
  const ready = Boolean(catalog && index && active?.generation);
  sendJson(
    response,
    ready ? 200 : 503,
    {
      status: ready ? "ready" : "not-ready",
      generation: active?.generation || null,
    },
    config,
    "no-store",
  );
  return true;
}

export default function __moduleApi0() {
  return { handleHealthRoute };
}
