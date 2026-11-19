import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/metrics.mjs";
const { recordRequest, renderMetrics, startRequest } = __moduleApi0();

test("records request totals and renders escaped labels", () => {
  startRequest();
  recordRequest({ method: "GET", path: '/quoted"path', status: 200, durationMs: 12, bytes: 5 });
  recordRequest({ method: null, path: null, status: 0, durationMs: 0, bytes: 0 });
  const metrics = renderMetrics();
  expect(metrics).toContain("nodejs_repository_http_requests_total");
  expect(metrics).toContain('status="200"');
  expect(metrics).toContain('GET",path="/quoted\\\"path');
  expect(metrics).toContain('method="-",path="/"');
  expect(metrics).toContain("nodejs_repository_http_response_bytes_total");
});
