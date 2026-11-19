import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/metadata/catalog-route.mjs";
const { handleCatalogRoute } = __moduleApi0();
import __moduleApifix1 from "../../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix1();
import { createHealthMetadata } from "../../../test-fixtures/filesystem.mjs";
import { Writable } from "node:stream";
import { once } from "node:events";

class MockResponse extends Writable {
  constructor() {
    super();
    this.req = { method: "GET" };
    this.statusCode = null;
    this.body = Buffer.alloc(0);
  }
  writeHead(statusCode) {
    this.statusCode = statusCode;
  }
  _write(chunk, encoding, callback) {
    this.body = Buffer.concat([this.body, Buffer.from(chunk)]);
    callback();
  }
}

async function responseFor(publicDir) {
  const response = new MockResponse();
  const finished = once(response, "finish");
  await handleCatalogRoute(response, "/api/v1/catalog", { publicDir });
  await finished;
  return response;
}

test("serves a versioned catalog and reports missing metadata", async () => {
  const success = await responseFor(await createHealthMetadata());
  expect(success.statusCode).toBe(200);
  expect(JSON.parse(success.body).metadata_version).toBe(SUPPORTED_METADATA_VERSION);
  const failure = await responseFor("/missing-catalog-fixture");
  expect(failure.statusCode).toBe(503);
  expect(JSON.parse(failure.body)).toEqual({ error: "catalog unavailable" });
});

test("ignores unrelated catalog paths", async () => {
  expect(await handleCatalogRoute(new MockResponse(), "/api/v1/other", {})).toBe(false);
});
