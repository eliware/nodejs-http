import metricsApi from "../metrics.mjs";
const { renderMetrics } = metricsApi();

function handleMetricsRoute(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(request.method === "HEAD" ? undefined : renderMetrics());
  return true;
}

export default function __moduleApi0() {
  return { handleMetricsRoute };
}
