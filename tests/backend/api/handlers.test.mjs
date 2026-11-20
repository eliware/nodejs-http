import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/handlers.mjs";
const { handleDirectoryApi } = __moduleApi0();
import { createRepositoryRoot, writeRepositoryIndex } from "../../../test-fixtures/filesystem.mjs";

function responseFor(method = "GET") {
  return {
    req: { method },
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

const config = { publicDir: "missing-public-root", securityHeaders: false, compression: false };

test("ignores unrelated directory API paths", async () => {
  const response = responseFor();
  await expect(
    handleDirectoryApi({ url: "/api/v1/list" }, response, "/api/v1/other", config),
  ).resolves.toBe(false);
  expect(response.statusCode).toBeNull();
});

test("normalizes directory API paths and returns successful indexed listings", async () => {
  const publicDir = await createRepositoryRoot();
  await writeRepositoryIndex(publicDir, {
    "/el10/": { entries: [{ name: "gluster.rpm", type: "file" }] },
  });
  const response = responseFor();
  await handleDirectoryApi(
    { url: "/api/v1/list?path=el10&q=gluster&sort=name&order=asc&offset=0&limit=10" },
    response,
    "/api/v1/list",
    { ...config, publicDir },
  );
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).entries[0].name).toBe("gluster.rpm");
  const unavailable = responseFor();
  await handleDirectoryApi(
    { url: "/api/v1/list?path=%2Fmissing" },
    unavailable,
    "/api/v1/list",
    config,
  );
  expect(unavailable.statusCode).toBe(404);
});
