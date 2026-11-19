import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/repository-directory.mjs";
const { repositoryDirectory } = __moduleApi0();
import {
  addOutsideSecret,
  createGuideFile,
  createRepositoryRoot,
  writeRepositoryIndex,
} from "../../test-fixtures/filesystem.mjs";

test("lists the repository root without treating it as index.html", async () => {
  const publicDir = await createRepositoryRoot();

  const listing = await repositoryDirectory({ publicDir, allowDotfiles: false }, "/");

  expect(listing.path).toBe("/");
  expect(listing.entries.map((entry) => entry.name)).toEqual(["el10", "glusterfs-el10.repo"]);
  expect(listing.entries[0].href).toBe("/el10/");
});

test("filters, sorts, paginates, and normalizes indexed directory listings", async () => {
  const publicDir = await createRepositoryRoot();
  await writeRepositoryIndex(publicDir, {
    "/el10/": {
      entries: [
        { name: "z.rpm", type: "file", size: 8, modified: "2026-02-01" },
        { name: "a.rpm", type: "file", size: 2, modified: "2026-01-01" },
        { name: "x86_64", type: "directory" },
        { name: "no-size.rpm", type: "file" },
      ],
      validation: { passed: true },
      container_validation: { passed: false },
    },
  });
  const config = { publicDir };
  const page = await repositoryDirectory(config, "//el10//", {
    query: "rpm",
    sort: "size",
    order: "desc",
    offset: "1",
    limit: "1",
  });
  expect(page.path).toBe("/el10/");
  expect(page.total).toBe(3);
  expect(page.entries[0].name).toBe("a.rpm");
  expect(page.hasMore).toBe(true);
  expect(page.validation).toEqual({ passed: true });
  expect(page.container_validation).toEqual({ passed: false });
  const capped = await repositoryDirectory(config, "el10", { limit: "900" });
  expect(capped.limit).toBe(500);
  expect(capped.entries[0].type).toBe("directory");
  expect(
    (await repositoryDirectory(config, "/el10", { sort: "modified", order: "desc" })).entries[0]
      .name,
  ).toBe("z.rpm");
  expect(
    (await repositoryDirectory(config, "/el10", { sort: "name", order: "desc" })).entries.map(
      (entry) => entry.name,
    ),
  ).toEqual(["x86_64", "z.rpm", "no-size.rpm", "a.rpm"]);
  expect(
    (await repositoryDirectory(config, "/el10", { sort: "name", offset: "invalid", limit: "0" }))
      .limit,
  ).toBe(500);
  expect(
    (await repositoryDirectory(config, "/el10", { sort: "size", order: "desc" })).entries,
  ).toHaveLength(4);
  await repositoryDirectory(config, "/el10");
  await repositoryDirectory(config, "/el10");
  expect(
    (await repositoryDirectory(config, "/el10", { sort: "size", order: "asc" })).entries.map(
      (entry) => entry.name,
    ),
  ).toContain("no-size.rpm");
  await writeRepositoryIndex(publicDir, { "/empty/": {} });
  expect((await repositoryDirectory(config, "/empty")).entries).toEqual([]);
});

test("reads fallback directories, metadata, dotfiles, and rejects invalid paths", async () => {
  const publicDir = await createRepositoryRoot();
  const filtered = await repositoryDirectory({ publicDir, allowDotfiles: false }, "/");
  expect(filtered.entries.map((entry) => entry.name)).not.toContain(".hidden");
  const included = await repositoryDirectory({ publicDir, allowDotfiles: true }, "/");
  expect(included.entries.map((entry) => entry.name)).toContain(".hidden");
  await expect(repositoryDirectory({ publicDir }, "/missing")).rejects.toThrow("ENOENT");
  expect(await repositoryDirectory({ publicDir }, "/glusterfs-el10.repo")).toBeNull();
  await createGuideFile(
    publicDir,
    `${publicDir}/validation.json`,
    JSON.stringify({ checks: ["passed"] }),
  );
  await createGuideFile(
    publicDir,
    `${publicDir}/container-validation.json`,
    JSON.stringify({ checks: ["container"] }),
  );
  const withMetadata = await repositoryDirectory({ publicDir }, "/");
  expect(withMetadata.validation.checks).toContain("passed");
  expect(withMetadata.container_validation.checks).toContain("container");
  expect(await repositoryDirectory({ publicDir }, "/../../outside")).toBeNull();
  const dirs = (await import("../../src/backend/repository-directory.mjs")).default();
  const paths = await dirs.repositoryDirectories({ publicDir, allowDotfiles: false });
  expect(paths).toContain("/el10/");
  expect(paths).not.toContain("/.hidden/");
  expect(await dirs.repositoryDirectories({ publicDir, allowDotfiles: true })).toContain(
    "/.hidden/",
  );
});

test("rejects repository links that resolve outside the configured root", async () => {
  const publicDir = await createRepositoryRoot();
  if (!(await addOutsideSecret(publicDir))) return;
  await expect(repositoryDirectory({ publicDir }, "/secret.txt")).resolves.toBeNull();
});

test("rejects a resolved repository path outside its root", async () => {
  const root = "C:\\public";
  const filesystem = {
    stat: async () => {
      throw new Error("no index");
    },
    realpath: async (value) => (value === root ? root : "C:\\outside\\secret"),
  };
  await expect(
    repositoryDirectory({ publicDir: root }, "/secret", {}, filesystem),
  ).resolves.toBeNull();
});

test("lists directories from index data without walking the file tree", async () => {
  const publicDir = await createRepositoryRoot();
  await writeRepositoryIndex(publicDir, { "/el10/": { entries: [] }, "/": { entries: [] } });
  const { repositoryDirectories } = (
    await import("../../src/backend/repository-directory.mjs")
  ).default();
  expect(await repositoryDirectories({ publicDir })).toEqual(["/", "/el10/"]);
});
