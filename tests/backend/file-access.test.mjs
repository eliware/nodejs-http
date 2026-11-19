import { expect } from "@jest/globals";
import path from "node:path";
import { addOutsideSecret, createStaticDirectory } from "../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../src/backend/file-access.mjs";
const { fileExists, staticFileExists } = __moduleApi0();

test("resolves public files and rejects directories or outside paths", async () => {
  const publicDir = await createStaticDirectory();
  const file = path.join(publicDir, "hello.txt");

  expect((await fileExists(file, { publicDir, allowSymlinks: false })).path).toBe(file);
  expect(await fileExists(path.join(publicDir, "folder"), { publicDir })).toBeNull();
  expect(await fileExists(path.join(publicDir, "missing"), { publicDir })).toBeNull();
  expect(await fileExists(path.join(publicDir, "..", "secret"), { publicDir })).toBeNull();
  const cached = { stats: { size: 3 }, body: Buffer.from("hot") };
  expect(await fileExists(file, { publicDir, ramCacheStore: new Map([[file, cached]]) })).toEqual({
    path: file,
    ...cached,
  });
  expect((await fileExists(file, { publicDir, allowSymlinks: true })).path).toBe(file);
});

test("resolves static files and blocks path escapes", async () => {
  const root = await createStaticDirectory();

  expect((await staticFileExists(root, "/", {})).path).toBe(path.join(root, "index.html"));
  expect((await staticFileExists(root, "/hello.txt", { allowSymlinks: false })).stats.size).toBe(
    11,
  );
  expect(await staticFileExists(root, "/missing", {})).toBeNull();
  expect(await staticFileExists(root, "/../../outside", { allowSymlinks: true })).toBeNull();
  expect(await staticFileExists(root, "/folder", {})).toBeNull();
});

test("rejects links outside the public root even when symlink access is enabled", async () => {
  const root = await createStaticDirectory();
  if (!(await addOutsideSecret(root))) return;

  expect(await fileExists(path.join(root, "secret.txt"), { publicDir: root })).toBeNull();
  expect(
    await fileExists(path.join(root, "secret.txt"), { publicDir: root, allowSymlinks: true }),
  ).toBeNull();
  expect(await staticFileExists(root, "/secret.txt", { allowSymlinks: false })).toBeNull();
  expect(await staticFileExists(root, "/secret.txt", { allowSymlinks: true })).toBeNull();
});

test("rejects lexically resolved file paths outside the root", async () => {
  const root = "C:\\public";
  const outside = "C:\\outside\\secret.txt";
  const inside = path.join(root, "secret.txt");
  const filesystem = {
    realpath: async (value) => (value === root ? root : outside),
    stat: async () => {
      throw new Error("outside path");
    },
    lstat: async () => ({ isSymbolicLink: () => false }),
  };

  await expect(
    fileExists(inside, { publicDir: root, allowSymlinks: true }, filesystem),
  ).resolves.toBeNull();
});

test("rejects symbolic links when they are disabled", async () => {
  const root = path.resolve("public");
  const file = path.join(root, "linked.txt");
  const filesystem = {
    realpath: async (value) => value,
    lstat: async (value) => ({ isSymbolicLink: () => value === file }),
  };
  await expect(
    fileExists(file, { publicDir: root, allowSymlinks: false }, filesystem),
  ).resolves.toBeNull();
});

test("rejects a symbolic public root when symbolic links are disabled", async () => {
  const root = "C:\\public";
  const file = path.join(root, "file.txt");
  const filesystem = { lstat: async () => ({ isSymbolicLink: () => true }) };
  await expect(
    fileExists(file, { publicDir: root, allowSymlinks: false }, filesystem),
  ).resolves.toBeNull();
});
