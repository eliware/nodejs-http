import { expect, test } from "@jest/globals";
import path from "node:path";
import __moduleApi0 from "../../../src/backend/directory/request.mjs";
const { resolveDirectoryRequest } = __moduleApi0();
import __moduleApifix1 from "../../../src/backend/config.mjs";
const { loadConfig } = __moduleApifix1();
import { createHttpResponse, readHttpBody } from "../../../test-fixtures/http-response.mjs";
import {
  addOutsideFileLink,
  createGuideFile,
  createRepositoryRoot,
  createRequestDirectory,
} from "../../../test-fixtures/filesystem.mjs";

async function resolve(root, pathName, requestUrl = pathName, changes = {}, filesystem) {
  const request = { method: "GET", url: requestUrl, headers: {} };
  const response = createHttpResponse("GET");
  const config = {
    ...loadConfig({ PUBLIC_DIR: root, COMPRESSION: "false", ACCESS_LOG: "false" }),
    directoryTemplate: path.join(root, "directory-listing.html"),
    ...changes,
  };
  const body = readHttpBody(response);
  const result = await resolveDirectoryRequest(
    request,
    response,
    path.join(root, pathName.replace(/^\//, "")),
    pathName,
    config,
    filesystem,
  );
  if (result.handled) return { result, response, body: (await body).toString() };
  return { result, response };
}

test("returns files and leaves missing or non-directory paths for normal routing", async () => {
  const root = await createRequestDirectory();
  const file = await resolve(root, "/file.txt");
  const missing = await resolve(root, "/missing/");

  expect(file.result).toEqual({ handled: false, file: null });
  expect(missing.result).toEqual({ handled: false, file: null });
});

test("redirects directory paths and retains query parameters", async () => {
  const root = await createRequestDirectory();
  const result = await resolve(root, "/dir", "/dir?sort=name");

  expect(result.result).toEqual({ handled: true });
  expect(result.response.statusCode).toBe(301);
  expect(result.response.headers.Location).toBe("/dir/?sort=name");
});

test("serves directory indexes and creates listings when no index exists", async () => {
  const root = await createRequestDirectory();
  await createGuideFile(root, path.join(root, "dir", "index.html"), "directory index");
  const indexed = await resolve(root, "/dir/");
  expect(indexed.result.file.path).toBe(path.join(root, "dir", "index.html"));

  const listingRoot = await createRequestDirectory();
  const listing = await resolve(listingRoot, "/dir/");
  expect(listing.result).toEqual({ handled: true });
  expect(listing.response.statusCode).toBe(200);
  expect(listing.body).toContain("Index of /dir/");
});

test("serves the publication-root directory listing", async () => {
  const root = await createRepositoryRoot();
  const result = await resolve(root, "/", "/");

  expect(result.result).toEqual({ handled: true });
  expect(result.response.statusCode).toBe(200);
  expect(result.body).toContain("Index of /");
});

test("does not serve an external index symlink when symlinks are enabled", async () => {
  const root = await createRequestDirectory();
  if (!(await addOutsideFileLink(root, path.join(root, "dir", "index.html"), "private"))) return;
  const result = await resolve(root, "/dir/", "/dir/", {
    allowSymlinks: true,
    directoryListing: false,
  });
  expect(result.result).toEqual({ handled: false, file: null });
});

test("leaves directories unhandled when listings are disabled", async () => {
  const root = await createRequestDirectory();
  const result = await resolve(root, "/dir/", "/dir/", { directoryListing: false });

  expect(result.result).toEqual({ handled: false, file: null });
});

test("rejects resolved paths outside the repository", async () => {
  const root = await createRequestDirectory();
  const result = await resolve(
    root,
    "/secret/",
    "/secret/",
    {},
    {
      lstat: async () => ({ isSymbolicLink: () => false }),
      realpath: async (value) => (value === root ? root : path.resolve(root, "..", "secret")),
    },
  );

  expect(result.result).toEqual({ handled: true });
  expect(result.response.statusCode).toBe(404);
  expect(result.body).toContain("Not Found");
});

test("rejects a symbolic public root unless symbolic links are enabled", async () => {
  const root = await createRequestDirectory();
  await createGuideFile(root, path.join(root, "dir", "index.html"), "directory index");
  const filesystem = {
    lstat: async (value) =>
      value === root ? { isSymbolicLink: () => true } : { isSymbolicLink: () => false },
    realpath: async (value) => value,
    stat: async (value) => ({ isDirectory: () => path.resolve(value) === path.join(root, "dir") }),
  };
  const blocked = await resolve(root, "/dir/", "/dir/", {}, filesystem);
  expect(blocked.result).toEqual({ handled: true });
  expect(blocked.response.statusCode).toBe(404);

  const allowed = await resolve(root, "/dir/", "/dir/", { allowSymlinks: true }, filesystem);
  expect(allowed.result.file.path).toBe(path.join(root, "dir", "index.html"));
});
