function labels(values) {
  return Object.entries(values)
    .map(([key, value]) => `${key}="${String(value).replaceAll('"', '\\"')}"`)
    .join(",");
}

function renderMetrics(state) {
  const lines = [
    "# HELP nodejs_repository_http_requests_total Total HTTP requests.",
    "# TYPE nodejs_repository_http_requests_total counter",
    `nodejs_repository_http_requests_total ${state.requests}`,
    "# HELP nodejs_repository_http_active_requests Current active HTTP requests.",
    "# TYPE nodejs_repository_http_active_requests gauge",
    `nodejs_repository_http_active_requests ${state.active}`,
    "# HELP nodejs_repository_http_response_bytes_total Total response bytes.",
    "# TYPE nodejs_repository_http_response_bytes_total counter",
    `nodejs_repository_http_response_bytes_total ${state.bytes}`,
    "# HELP nodejs_repository_http_request_duration_ms_total Cumulative request duration in milliseconds.",
    "# TYPE nodejs_repository_http_request_duration_ms_total counter",
    `nodejs_repository_http_request_duration_ms_total ${state.durationMs}`,
  ];
  for (const [status, count] of state.status)
    lines.push(`nodejs_repository_http_requests_by_status_total{${labels({ status })}} ${count}`);
  for (const [request, count] of state.paths) {
    const [method, ...pathParts] = request.split(" ");
    lines.push(
      `nodejs_repository_http_requests_by_path_total{${labels({ method, path: pathParts.join(" ") })}} ${count}`,
    );
  }
  return `${lines.join("\n")}\n`;
}

export default function __moduleApi0() {
  return { renderMetrics };
}
