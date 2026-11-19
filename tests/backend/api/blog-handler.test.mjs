import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/blog-handler.mjs";
const { handleBlogApi } = __moduleApi0();

function response() {
  return {
    req: { method: "GET", headers: {} },
    statusCode: null,
    headers: {},
    body: "",
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body) {
      if (body !== undefined) this.body += body.toString();
    },
  };
}

test("returns not found when an article path contains a nested slug", async () => {
  const result = response();
  await expect(
    handleBlogApi(result, "/api/v1/blogs/post/extra", {
      securityHeaders: false,
      compression: false,
    }),
  ).resolves.toBe(true);
  expect(result.statusCode).toBe(404);
  expect(JSON.parse(result.body)).toEqual({ error: "blog post not found" });
});
