import { expect, test } from "@jest/globals";
import { createRepositoryRoot, createGuideFile } from "../../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../../src/backend/directory/filesystem.mjs";
const { readFilesystemDirectory } = __moduleApi0();

test("reads directory entries and validation records under the repository root", async () => {
  const publicDir = await createRepositoryRoot();
  await createGuideFile(publicDir, `${publicDir}/validation.json`, '{"status":"passed"}');
  await createGuideFile(
    publicDir,
    `${publicDir}/container-validation.json`,
    '{"status":"checked"}',
  );

  const listing = await readFilesystemDirectory({ publicDir, allowDotfiles: false }, "/");

  expect(listing.entries.map((entry) => entry.name)).not.toContain(".hidden");
  expect(listing.entries.find((entry) => entry.name === "el10").href).toBe("/el10/");
  expect(listing.validation).toEqual({ status: "passed" });
  expect(listing.container_validation).toEqual({ status: "checked" });
});

test("returns null for files and paths outside the resolved root", async () => {
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
