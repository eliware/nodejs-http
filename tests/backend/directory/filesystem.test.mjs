import { expect, test } from "@jest/globals";
import {
  addOutsideSecret,
  addBrokenFileLink,
  createRepositoryRoot,
  createGuideFile,
  createStaticDirectory,
} from "../../../test-fixtures/filesystem.mjs";
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

test("encodes every segment in fallback directory links", async () => {
  const publicDir = await createRepositoryRoot();
  await createGuideFile(publicDir, `${publicDir}/dir with%name/file #1.rpm`, "package");
  const listing = await readFilesystemDirectory({ publicDir }, "/dir with%name");
  expect(listing.entries[0].href).toBe("/dir%20with%25name/file%20%231.rpm");
});

test("classifies allowed in-root directory symlinks and hides outside symlinks", async () => {
  const publicDir = await createStaticDirectory();
  if (!(await addOutsideSecret(publicDir))) return;
  if (!(await addBrokenFileLink(publicDir, `${publicDir}/broken-link`))) return;
  const restrictedListing = await readFilesystemDirectory(
    { publicDir, allowDotfiles: false, allowSymlinks: false },
    "/",
  );
  expect(restrictedListing.entries.map((entry) => entry.name)).not.toContain("secret.txt");
  const listing = await readFilesystemDirectory(
    { publicDir, allowDotfiles: false, allowSymlinks: true },
    "/folder/",
  );
  const linkedDirectory = listing.entries.find((entry) => entry.name === "linked-calc");
  expect(linkedDirectory).toEqual({
    name: "linked-calc",
    type: "directory",
    href: "/folder/linked-calc/",
  });
  const rootListing = await readFilesystemDirectory(
    { publicDir, allowDotfiles: false, allowSymlinks: true },
    "/",
  );
  expect(rootListing.entries.map((entry) => entry.name)).not.toContain("secret.txt");
  expect(rootListing.entries.map((entry) => entry.name)).not.toContain("broken-link");
});

test("omits allowed symlinks that target special files", async () => {
  const publicDir = "/repo";
  const filesystem = {
    realpath: async (value) => value,
    stat: async (value) => ({
      isDirectory: () => value === publicDir,
      isFile: () => false,
    }),
    readdir: async () => [
      {
        name: "socket-link",
        isDirectory: () => false,
        isFile: () => false,
        isSymbolicLink: () => true,
      },
      {
        name: "socket",
        isDirectory: () => false,
        isFile: () => false,
        isSymbolicLink: () => false,
      },
    ],
    readFile: async () => {
      throw new Error("missing metadata");
    },
  };
  const listing = await readFilesystemDirectory(
    { publicDir, allowSymlinks: true, allowDotfiles: false },
    "/",
    filesystem,
  );
  expect(listing.entries).toEqual([]);
});
