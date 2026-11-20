import { randomUUID } from "node:crypto";
import metricsApi from "../metrics.mjs";
const { cancelRequest, recordRequest, startRequest } = metricsApi();

function requestIdentifier(request) {
  const supplied = request.headers?.["x-request-id"];
  return typeof supplied === "string" &&
    supplied.length <= 128 &&
    /^[A-Za-z0-9._:-]+$/.test(supplied)
    ? supplied
    : randomUUID();
}

function observeRequest(request, response, config, logger) {
  const started = Date.now();
  const requestId = requestIdentifier(request);
  response.setHeader?.("X-Request-ID", requestId);
  startRequest();
  let settled = false;
  response.once("finish", () => {
    if (settled) return;
    settled = true;
    const durationMs = Date.now() - started;
    const bytes =
      Number(typeof response.getHeader === "function" ? response.getHeader("Content-Length") : 0) ||
      0;
    recordRequest({
      method: request.method,
      path: request.url,
      status: response.statusCode,
      durationMs,
      bytes,
    });
    if (!config.accessLog || config.logLevel === "silent") return;
    const entry = {
      timestamp: new Date().toISOString(),
      request_id: requestId,
      method: request.method || "-",
      path: request.url || "/",
      status: response.statusCode,
      duration_ms: durationMs,
      bytes,
    };
    logger.info(
      config.structuredLogs
        ? "HTTP request"
        : `${entry.method} ${entry.path} ${entry.status} ${entry.duration_ms}ms`,
      config.structuredLogs ? entry : undefined,
    );
  });
  response.once("close", () => {
    if (settled) return;
    settled = true;
    cancelRequest();
  });
}

export default function __moduleApi0() {
  return { observeRequest };
}
