import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/blog-handler.mjs";
const { handleBlogApi } = __moduleApi0();

test("ignores paths outside the blog API", async () => {
  const response = {
    req: { method: "GET", headers: {} },
    writeHead() {},
    end() {},
  };
  await expect(
    handleBlogApi(response, "/api/v1/blogs-extra", {
      securityHeaders: false,
      compression: false,
    }),
  ).resolves.toBe(false);
});
