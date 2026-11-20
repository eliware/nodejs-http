import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "./response.mjs";
const { sendJson } = __moduleApi1();
import healthMetricsApi from "./health/metrics.mjs";
const { handleMetricsRoute } = healthMetricsApi();
import __moduleApifix2 from "./metadata/version.mjs";
const { assertMetadataVersion } = __moduleApifix2();

async function handleHealthRoute(request, response, requestPath, config) {
  if (requestPath === "/health" || requestPath === "/healthz") {
    sendJson(response, 200, { status: "ok" }, config, "no-store");
    return true;
  }
  if (requestPath === "/metrics") {
    return handleMetricsRoute(request, response);
  }
  if (requestPath !== "/ready" && requestPath !== "/readyz") return false;
  return checkReadiness(response, config);
}

async function checkReadiness(response, config) {
  let catalog = false;
  try {
    const value = assertMetadataVersion(
      JSON.parse(await fs.readFile(path.join(config.publicDir, "metadata/catalog.json"), "utf8")),
      "catalog.json",
    );
    catalog =
      value.stable?.available === true &&
      typeof value.stable.latest?.node_version === "string" &&
      Boolean(value.stable.latest.node_version.trim());
  } catch {}
  let index = false;
  try {
    const value = assertMetadataVersion(
      JSON.parse(
        await fs.readFile(path.join(config.publicDir, "metadata/repository-index.json"), "utf8"),
      ),
      "repository-index.json",
    );
    index = Boolean(value.directories && typeof value.directories === "object");
  } catch {}
  let active = null;
  try {
    active = assertMetadataVersion(
      JSON.parse(
        await fs.readFile(path.join(config.publicDir, "metadata/active-generation.json"), "utf8"),
      ),
      "active-generation.json",
    );
    if (
      typeof active.generation !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(active.generation)
    )
      throw new Error("invalid generation identifier");
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
