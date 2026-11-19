import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/request/repository-files.mjs";
const { resolveRepositoryFile } = __moduleApi0();
import __moduleApifixConfig from "../../../src/backend/config.mjs";
const { loadConfig } = __moduleApifixConfig();
import { createRequestDirectory } from "../../../test-fixtures/filesystem.mjs";

function response() {
  return {
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end() {
      this.ended = true;
    },
  };
}

test("resolves repository files and returns missing files", async () => {
  const publicDir = await createRequestDirectory();
  const config = loadConfig({ PUBLIC_DIR: publicDir, ACCESS_LOG: "false" });
  const request = { method: "GET", url: "/file.txt" };
  const found = await resolveRepositoryFile(request, response(), "/file.txt", config);
  expect(found.handled).toBe(false);
  expect(found.file.path).toContain("file.txt");

  const missing = await resolveRepositoryFile(request, response(), "/missing", {
    ...config,
    directoryIndex: false,
  });
  expect(missing).toEqual({ handled: false, file: null });
});

test("handles directory redirects before file delivery", async () => {
  const publicDir = await createRequestDirectory();
  const config = loadConfig({ PUBLIC_DIR: publicDir, ACCESS_LOG: "false" });
  const output = response();
  const result = await resolveRepositoryFile(
    { method: "GET", url: "/dir?view=all" },
    output,
    "/dir",
    config,
  );
  expect(result).toEqual({ handled: true });
  expect(output.statusCode).toBe(301);
  expect(output.headers.Location).toBe("/dir/?view=all");
});
