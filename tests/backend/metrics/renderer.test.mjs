import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/metrics/renderer.mjs";
const { renderMetrics } = __moduleApi0();

test("formats counters and escaped status and request labels", () => {
  const output = renderMetrics({
    requests: 2,
    active: 1,
    bytes: 15,
    durationMs: 25,
    status: new Map([["200", 2]]),
    paths: new Map([['GET /quoted"path', 1]]),
  });
  expect(output).toContain("nodejs_repository_http_requests_total 2");
  expect(output).toContain('status="200"');
  expect(output).toContain('GET",path="/quoted\\"path');
  expect(output.endsWith("\n")).toBe(true);
});
