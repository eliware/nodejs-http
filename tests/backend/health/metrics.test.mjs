import { Writable } from "node:stream";
import { once } from "node:events";
import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/health/metrics.mjs";
const { handleMetricsRoute } = __moduleApi0();

class MockResponse extends Writable {
  constructor() {
    super();
    this.statusCode = null;
    this.headers = {};
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

async function responseFor(method) {
  const response = new MockResponse();
  const finished = once(response, "finish");
  expect(handleMetricsRoute({ method }, response)).toBe(true);
  await finished;
  return response;
}

test("sends an uncached metrics body for GET", async () => {
  const response = await responseFor("GET");
  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Type"]).toContain("text/plain");
  expect(response.headers["Cache-Control"]).toBe("no-store");
  expect(response.body.toString()).toContain("nodejs_repository_http_requests_total");
});

test("omits the metrics body for HEAD", async () => {
  const response = await responseFor("HEAD");
  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(0);
});
