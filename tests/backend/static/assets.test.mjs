import { expect, jest, test } from "@jest/globals";
import { createStaticSite } from "../../../test-fixtures/filesystem.mjs";
import { createHttpResponse, readHttpBody } from "../../../test-fixtures/http-response.mjs";
import __moduleApi0 from "../../../src/backend/static/assets.mjs";
const { serveStaticFile } = __moduleApi0();

const configFor = (staticDir, extra = {}) => ({
  staticDir,
  allowSymlinks: false,
  defaultMimeType: "application/octet-stream",
  securityHeaders: true,
  corsOrigin: "",
  cacheControl: "",
  lastModified: true,
  etag: true,
  compression: false,
  compressionMinBytes: 1024,
  ...extra,
});

async function serve(root, requestPath, method = "GET", headers = {}, config = {}) {
  const response = createHttpResponse(method, headers);
  const body = readHttpBody(response);
  const found = await serveStaticFile(response, response.req, requestPath, configFor(root, config));
  if (!found) response.end();
  return { found, response, body: (await body).toString() };
}

test("returns false for missing files and serves HTML with runtime tokens", async () => {
  const root = await createStaticSite();
  expect((await serve(root, "/missing")).found).toBe(false);
  const html = await serve(root, "/index.html");
  expect(html.found).toBe(true);
  expect(html.response.statusCode).toBe(200);
  expect(html.body).toContain("home");
  expect(html.body).not.toContain("__HOST_ID__");
  expect(html.body).not.toContain("__COPYRIGHT_YEAR__");
  expect(html.body).not.toContain("__APP_VERSION__");
  expect(html.body).not.toContain("__ASSET_VERSION__");
});

test("sets cache policies for web assets, public assets, and other files", async () => {
  const root = await createStaticSite();
  expect((await serve(root, "/web/app.js")).response.headers["Cache-Control"]).toBe(
    "public, max-age=60, must-revalidate",
  );
  expect((await serve(root, "/assets/logo.svg")).response.headers["Cache-Control"]).toBe(
    "public, max-age=31536000, immutable",
  );
  expect((await serve(root, "/robots.txt")).response.headers["Cache-Control"]).toBe(
    "public, max-age=60",
  );
});

test("sends HEAD responses without bodies and applies HTML cache headers", async () => {
  const root = await createStaticSite();
  const page = await serve(root, "/index.html", "HEAD");
  expect(page.found).toBe(true);
  expect(page.body).toBe("");
  expect(page.response.headers["Content-Length"]).toBeGreaterThan(0);
  const original = process.env.APP_VERSION;
  process.env.APP_VERSION = "test-version";
  const html = await serve(root, "/index.html");
  if (original === undefined) delete process.env.APP_VERSION;
  else process.env.APP_VERSION = original;
  expect(html.body).toContain("test-version");
  expect(html.body).not.toContain("__ASSET_VERSION__");
});

test("compresses accepted static bodies and honors encoding settings", async () => {
  const root = await createStaticSite();
  const file = await serve(
    root,
    "/web/app.js",
    "GET",
    { "accept-encoding": "gzip" },
    {
      compression: true,
      compressionMinBytes: 0,
    },
  );
  expect(file.response.headers["Content-Encoding"]).toBe("gzip");
  expect(file.response.headers.Vary).toBe("Accept-Encoding");
});

test("uses the extended copyright year after the base year", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2028-01-01T00:00:00Z"));
  const html = await serve(await createStaticSite(), "/index.html");
  expect(html.body).toContain("2026-2028");
  jest.useRealTimers();
});
