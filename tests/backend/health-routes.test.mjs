import { Writable } from "node:stream";
import { once } from "node:events";
import { describe, expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/health-routes.mjs";
const { handleHealthRoute } = __moduleApi0();
import __moduleApifix1 from "../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix1();
import {
  createHealthMetadata,
  setCatalogVersion,
  setGenerationRecord,
  writeHealthMetadata,
} from "../../test-fixtures/filesystem.mjs";

class MockResponse extends Writable {
  constructor(method = "GET") {
    super();
    this.req = { method };
    this.headers = {};
    this.statusCode = null;
    this.body = Buffer.alloc(0);
  }

  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    this.headers = headers;
  }

  _write(chunk, encoding, callback) {
    this.body = Buffer.concat([this.body, Buffer.from(chunk)]);
    callback();
  }
}

async function responseFor(callback, method = "GET") {
  const response = new MockResponse(method);
  const finished = once(response, "finish");
  await callback(response);
  await finished;
  return response;
}

async function metadataFixture({ active = true } = {}) {
  return { publicDir: await createHealthMetadata(active) };
}

const configFor = (publicDir) => ({ publicDir, securityHeaders: true });

describe("health and catalog routes", () => {
  test("dispatches metrics requests to the metrics handler", async () => {
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/metrics", configFor("/tmp")),
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.toString()).toContain("nodejs_repository_http_requests_total");
  });

  test("returns an uncached health response", async () => {
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/health", configFor("/tmp")),
    );
    expect(response.statusCode).toBe(200);
    expect(response.headers["Cache-Control"]).toBe("no-store");
    expect(JSON.parse(response.body).status).toBe("ok");
  });

  test("accepts the healthz alias", async () => {
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/healthz", configFor("/tmp")),
    );
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ status: "ok" });
  });

  test("ignores unrelated health paths", async () => {
    const response = new MockResponse();
    await expect(
      handleHealthRoute({ method: "GET" }, response, "/not-health", configFor("/tmp")),
    ).resolves.toBe(false);
  });

  test("reports readiness when all metadata is valid", async () => {
    const { publicDir } = await metadataFixture();
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/ready", configFor(publicDir)),
    );
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      status: "ready",
      generation: "run-1",
    });
  });

  test("accepts the readyz alias", async () => {
    const { publicDir } = await metadataFixture();
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/readyz", configFor(publicDir)),
    );
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).status).toBe("ready");
  });

  test("reports not-ready when active generation metadata is absent", async () => {
    const { publicDir } = await metadataFixture({ active: false });
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/ready", configFor(publicDir)),
    );
    expect(response.statusCode).toBe(503);
    expect(JSON.parse(response.body)).toEqual({
      status: "not-ready",
      generation: null,
    });
  });

  test("reports not-ready when the catalog version is invalid", async () => {
    const { publicDir } = await metadataFixture();
    await setCatalogVersion(publicDir, "9.9.9");
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/ready", configFor(publicDir)),
    );
    expect(response.statusCode).toBe(503);
    expect(JSON.parse(response.body).status).toBe("not-ready");
  });

  test.each([
    ["catalog", "metadata/catalog.json", { metadata_version: SUPPORTED_METADATA_VERSION }],
    [
      "repository index",
      "metadata/repository-index.json",
      { metadata_version: SUPPORTED_METADATA_VERSION },
    ],
  ])("reports not-ready when the %s structure is invalid", async (_name, file, value) => {
    const { publicDir } = await metadataFixture();
    await writeHealthMetadata(publicDir, file, value);
    const response = await responseFor((result) =>
      handleHealthRoute({ method: "GET" }, result, "/ready", configFor(publicDir)),
    );
    expect(response.statusCode).toBe(503);
    expect(JSON.parse(response.body).status).toBe("not-ready");
  });

  test("reports not-ready when the active generation identifier is unsafe", async () => {
    const { publicDir } = await metadataFixture();
    await writeHealthMetadata(publicDir, "metadata/active-generation.json", {
      metadata_version: SUPPORTED_METADATA_VERSION,
      generation: "../outside",
    });
    const response = await responseFor((result) =>
      handleHealthRoute({ method: "GET" }, result, "/ready", configFor(publicDir)),
    );
    expect(response.statusCode).toBe(503);
    expect(JSON.parse(response.body)).toEqual({ status: "not-ready", generation: null });
  });

  test.each([
    ["malformed JSON", "{"],
    [
      "unsupported metadata version",
      JSON.stringify({ metadata_version: "9.9.9", generation: "run-1" }),
    ],
    [
      "mismatched generation name",
      JSON.stringify({ metadata_version: SUPPORTED_METADATA_VERSION, generation: "run-2" }),
    ],
  ])("reports not-ready when the generation record has %s", async (_name, content) => {
    const { publicDir } = await metadataFixture();
    await setGenerationRecord(publicDir, content);
    const response = await responseFor((value) =>
      handleHealthRoute({ method: "GET" }, value, "/ready", configFor(publicDir)),
    );
    expect(response.statusCode).toBe(503);
    expect(JSON.parse(response.body)).toEqual({ status: "not-ready", generation: null });
  });
});
