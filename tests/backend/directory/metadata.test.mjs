import { expect, jest, test } from "@jest/globals";
import metadataApi from "../../../src/backend/directory/metadata.mjs";

const { readJson } = metadataApi();

test("reads JSON metadata from the requested directory", async () => {
  const filesystem = {
    readFile: jest.fn().mockResolvedValue('{"status":"passed"}'),
  };
  await expect(readJson("/repo", "validation.json", filesystem)).resolves.toEqual({
    status: "passed",
  });
  expect(filesystem.readFile).toHaveBeenCalledWith("/repo/validation.json", "utf8");
});

test("returns null when metadata cannot be read or parsed", async () => {
  const missingFileSystem = { readFile: jest.fn().mockRejectedValue(new Error("missing")) };
  const invalidFileSystem = { readFile: jest.fn().mockResolvedValue("not JSON") };
  await expect(readJson("/repo", "validation.json", missingFileSystem)).resolves.toBeNull();
  await expect(readJson("/repo", "validation.json", invalidFileSystem)).resolves.toBeNull();
});
