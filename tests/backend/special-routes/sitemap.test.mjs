import { expect, test } from "@jest/globals";
import { createHealthMetadata } from "../../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../../src/backend/special-routes/sitemap.mjs";
const { handleSitemapRequest } = __moduleApi0();

function response(method = "GET") {
  return {
    req: { method, headers: {} },
    writeHead(status, headers) {
      this.statusCode = status;
      this.headers = headers;
    },
    end(body) {
      this.body = body;
    },
  };
}

test("serves sitemap XML from current posts and repository directories", async () => {
  const output = response();
  const handled = await handleSitemapRequest(output, output.req, "/sitemap.xml", {
    publicDir: await createHealthMetadata(),
    blogStore: { published: async () => [{ slug: "guide", updated_at: "2026-01-01" }] },
  });
  expect(handled).toBe(true);
  expect(output.statusCode).toBe(200);
  expect(output.headers["Content-Type"]).toContain("application/xml");
  expect(output.body).toContain("<urlset");
  expect(output.body).toContain("/blog/guide");
});
