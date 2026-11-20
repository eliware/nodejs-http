import metricsRendererApi from "./metrics/prometheus.mjs";
const { renderMetrics: renderMetricsText } = metricsRendererApi();

const state = {
  requests: 0,
  active: 0,
  bytes: 0,
  durationMs: 0,
  status: new Map(),
  paths: new Map(),
};

function startRequest() {
  state.active += 1;
}

function cancelRequest() {
  state.active = Math.max(0, state.active - 1);
}

function recordRequest({ method, path, status, durationMs, bytes }) {
  state.requests += 1;
  state.active = Math.max(0, state.active - 1);
  state.bytes += Number(bytes) || 0;
  state.durationMs += Number(durationMs) || 0;
  const statusKey = String(status || 0);
  state.status.set(statusKey, (state.status.get(statusKey) || 0) + 1);
  const pathKey = `${method || "-"} ${path || "/"}`;
  state.paths.set(pathKey, (state.paths.get(pathKey) || 0) + 1);
}

function renderMetrics() {
  return renderMetricsText(state);
}

export default function __moduleApi0() {
  return { startRequest, cancelRequest, recordRequest, renderMetrics };
}
