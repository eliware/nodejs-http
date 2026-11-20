import { expect, test } from "@jest/globals";
import { platform } from "node:os";
import path from "node:path";
import {
  createGuideFile,
  createRepositoryRoot,
  replaceWithOutsideSymlink,
} from "../../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../../src/backend/guides/file-reader.mjs";
const { readGuideFile } = __moduleApi0();

test("reads a guide file under the repository root", async () => {
  const root = await createRepositoryRoot();
  const file = path.join(root, "content", "install", "centos10", "stable", "instructions.json");
  await createGuideFile(root, file, '{"title":"Install"}');
  const guide = await readGuideFile(root, "install", "centos10", "stable");
  expect(guide.content).toBe('{"title":"Install"}');
  expect(guide.publicRoot).toBe(root);
});

const testSymlink = platform() === "win32" ? test.skip : test;

testSymlink("rejects a guide symlink outside the repository", async () => {
  const root = await createRepositoryRoot();
  const file = path.join(root, "content", "install", "centos10", "stable", "instructions.json");
  await createGuideFile(root, file, "{}");
  await replaceWithOutsideSymlink(file);
  await expect(readGuideFile(root, "install", "centos10", "stable")).rejects.toThrow(
    "guide path is outside the repository",
  );
});

test("rejects a guide path that changes outside the root after opening", async () => {
  let fileReads = 0;
  let closed = false;
  const filesystem = {
    realpath: async (value) => {
      if (value === "/race-root") return "/race-root";
      fileReads += 1;
      return fileReads === 1 ? value : "/outside/instructions.json";
    },
    open: async () => ({
      stat: async () => ({ dev: 1, ino: 1 }),
      readFile: async () => "{}",
      close: async () => {
        closed = true;
      },
    }),
  };
  await expect(
    readGuideFile("/race-root", "install", "centos10", "stable", filesystem),
  ).rejects.toThrow("guide path is outside the repository");
  expect(closed).toBe(true);
});

test("rejects a guide path that resolves outside the root before opening", async () => {
  let opened = false;
  const filesystem = {
    realpath: async (value) =>
      value === "/early-outside-root" ? value : "/outside/instructions.json",
    open: async () => {
      opened = true;
    },
  };
  await expect(
    readGuideFile("/early-outside-root", "install", "centos10", "stable", filesystem),
  ).rejects.toThrow("guide path is outside the repository");
  expect(opened).toBe(false);
});

test("rejects a guide file replaced between opening and validation", async () => {
  const openedFile = { dev: 1, ino: 1 };
  const filesystem = {
    realpath: async (value) => value,
    open: async () => ({
      stat: async () => openedFile,
      readFile: async () => "{}",
      close: async () => {},
    }),
    stat: async () => ({ dev: 1, ino: 2 }),
  };
  await expect(
    readGuideFile("/stable-root", "install", "centos10", "stable", filesystem),
  ).rejects.toThrow("guide file changed while it was being read");
});
