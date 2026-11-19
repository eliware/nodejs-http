import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/index.mjs";
const { readRepositoryIndex } = __moduleApi0();
import __moduleApifix1 from "../../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix1();

function filesystem(publicDir, content, mtimeMs = 1) {
  return {
    stat: jest.fn().mockResolvedValue({ mtimeMs, size: content.length }),
    readFile: jest.fn().mockResolvedValue(content),
    indexPath: `${publicDir}/metadata/repository-index.json`,
  };
}

test("reads and caches a valid repository index by path and file stamp", async () => {
  const publicDir = "/fixture/index-cache";
  const fs = filesystem(
    publicDir,
    JSON.stringify({ metadata_version: SUPPORTED_METADATA_VERSION, directories: { "/": {} } }),
  );
  const config = { publicDir };

  const first = await readRepositoryIndex(config, fs);
  const second = await readRepositoryIndex(config, fs);

  expect(first.directories).toEqual({ "/": {} });
  expect(second).toBe(first);
  expect(fs.stat).toHaveBeenCalledTimes(2);
  expect(fs.readFile).toHaveBeenCalledTimes(1);
});

test("returns no index for invalid JSON, schema versions, and file access failures", async () => {
  const malformed = filesystem("/fixture/index-malformed", "{");
  const unsupported = filesystem(
    "/fixture/index-version",
    JSON.stringify({ metadata_version: "old" }),
  );
  const inaccessible = {
    stat: jest.fn().mockRejectedValue(new Error("offline")),
    readFile: jest.fn(),
  };

  await expect(
    readRepositoryIndex({ publicDir: "/fixture/index-malformed" }, malformed),
  ).resolves.toBeNull();
  await expect(
    readRepositoryIndex({ publicDir: "/fixture/index-version" }, unsupported),
  ).resolves.toBeNull();
  await expect(
    readRepositoryIndex({ publicDir: "/fixture/index-missing" }, inaccessible),
  ).resolves.toBeNull();
  expect(inaccessible.readFile).not.toHaveBeenCalled();
});
