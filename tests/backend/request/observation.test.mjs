import { EventEmitter } from "node:events";
import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/request/observation.mjs";
const { observeRequest } = __moduleApi0();

function response() {
  const value = new EventEmitter();
  value.statusCode = 200;
  value.headers = {};
  value.setHeader = (name, content) => {
    value.headers[name] = content;
  };
  value.getHeader = (name) => value.headers[name];
  return value;
}

const config = { accessLog: true, structuredLogs: true, logLevel: "info" };

test("validates request IDs and writes structured access records on finish", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  const logger = { info: jest.fn() };
  const requests = [
    { method: "GET", url: "/one", headers: { "x-request-id": "bad\r\nheader" } },
    { method: "GET", url: "/two", headers: { "x-request-id": "x".repeat(129) } },
    { method: "GET", url: "/three", headers: { "x-request-id": "trusted-123" } },
  ];
  const responses = requests.map(() => response());

  requests.forEach((request, index) => observeRequest(request, responses[index], config, logger));
  jest.advanceTimersByTime(25);
  responses.forEach((item) => item.emit("finish"));

  expect(responses[0].headers["X-Request-ID"]).toMatch(/^[0-9a-f-]{36}$/);
  expect(responses[1].headers["X-Request-ID"]).toMatch(/^[0-9a-f-]{36}$/);
  expect(responses[2].headers["X-Request-ID"]).toBe("trusted-123");
  expect(logger.info).toHaveBeenCalledTimes(3);
  expect(logger.info.mock.calls[0][1]).toMatchObject({
    request_id: responses[0].headers["X-Request-ID"],
    duration_ms: 25,
  });
  jest.useRealTimers();
});

test("writes plain access records and skips logs when disabled or silent", () => {
  const logger = { info: jest.fn() };
  const plain = response();
  observeRequest(
    { method: "GET", url: "/plain", headers: {} },
    plain,
    {
      ...config,
      structuredLogs: false,
    },
    logger,
  );
  plain.emit("finish");
  expect(logger.info.mock.calls[0][0]).toContain("GET /plain");
  expect(logger.info.mock.calls[0][1]).toBeUndefined();

  const disabled = response();
  observeRequest({}, disabled, { ...config, accessLog: false }, logger);
  disabled.emit("finish");
  const silent = response();
  observeRequest({}, silent, { ...config, logLevel: "silent" }, logger);
  silent.emit("finish");
  expect(logger.info).toHaveBeenCalledTimes(1);
});

test("observes responses without optional header methods", () => {
  const minimal = new EventEmitter();
  minimal.statusCode = 204;
  const logger = { info: jest.fn() };
  observeRequest({}, minimal, config, logger);
  minimal.emit("finish");
  expect(logger.info).toHaveBeenCalledWith(
    "HTTP request",
    expect.objectContaining({ method: "-", path: "/", bytes: 0 }),
  );
});
