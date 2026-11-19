function baseHeaders(config, request) {
  const headers = {};
  if (config.securityHeaders) {
    headers["X-Content-Type-Options"] = "nosniff";
    headers["X-Frame-Options"] = "SAMEORIGIN";
    headers["Referrer-Policy"] = "no-referrer";
    if (request?.socket?.encrypted)
      headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    headers["Content-Security-Policy"] =
      "default-src 'self'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'";
  }
  if (config.corsOrigin) headers["Access-Control-Allow-Origin"] = config.corsOrigin;
  if (config.cacheControl) headers["Cache-Control"] = config.cacheControl;
  return headers;
}

export default function __moduleApi0() {
  return { baseHeaders };
}
