import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/filesystem.mjs";
const { readFilesystemDirectory } = __moduleApi0();
import { createRepositoryRoot } from "../../../test-fixtures/filesystem.mjs";

test("rejects files, traversal, and paths outside the resolved root", async () => {
  const publicDir = await createRepositoryRoot();
  expect(await readFilesystemDirectory({ publicDir }, "/../secret.txt")).toBeNull();
  expect(await readFilesystemDirectory({ publicDir }, "/glusterfs-el10.repo")).toBeNull();
  const filesystem = {
    realpath: async (value) => (value === "C:\\public" ? value : "C:\\outside\\secret"),
    stat: async () => ({ isDirectory: () => true }),
  };
  await expect(
    readFilesystemDirectory({ publicDir: "C:\\public" }, "/secret", filesystem),
  ).resolves.toBeNull();
});
