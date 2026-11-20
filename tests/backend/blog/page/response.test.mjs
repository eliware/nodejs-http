import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/page/response.mjs";
const { sendBlogPageResponse } = __moduleApi0();
import { MockResponse } from "../../../../test-fixtures/blog/http.mjs";

const file = "/site/blog.html";
const body = "<main>Node.js release</main>";
const config = {
  compression: true,
  compressionMinBytes: 0,
  defaultMimeType: "text/html; charset=utf-8",
  etag: true,
  lastModified: true,
  securityHeaders: false,
};

test("sends blog pages with cache metadata and compressed bodies", async () => {
  const response = new MockResponse();
  await sendBlogPageResponse(
    response,
    { method: "GET", headers: { "accept-encoding": "gzip" } },
    file,
    body,
    config,
  );
  expect(response.statusCode).toBe(200);
  expect(response.headers["Cache-Control"]).toBe("public, max-age=60, must-revalidate");
  expect(response.headers["Content-Encoding"]).toBe("gzip");
  expect(response.body.length).toBe(Number(response.headers["Content-Length"]));
});

test("sends blog HEAD headers without a body", async () => {
  const response = new MockResponse();
  await sendBlogPageResponse(response, { method: "HEAD", headers: {} }, file, body, config);
  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Length"]).toBe(Buffer.byteLength(body));
  expect(response.body.length).toBe(0);
});
