import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/listing-data.mjs";
const { readDirectoryListingData } = __moduleApi0();

function entry(name, directory = false) {
  return {
    name,
    isDirectory: () => directory,
    isFile: () => !directory,
    isSymbolicLink: () => false,
  };
}

test("reads, filters, and sorts repository entries with metadata", async () => {
  const filesystem = {
    readdir: jest
      .fn()
      .mockResolvedValue([entry("z.txt"), entry("folder", true), entry("a.txt"), entry(".hidden")]),
    stat: jest.fn(async (filePath) => ({
      size: filePath.endsWith("a.txt") ? 2 : 4,
      isDirectory: () => filePath.endsWith("folder"),
      isFile: () => !filePath.endsWith("folder"),
    })),
    readFile: jest.fn(async (filePath) => {
      if (filePath.endsWith("container-validation.json")) return '{"passed":false}';
      if (filePath.endsWith("validation.json")) return '{"passed":true}';
      return "<main>{{ROWS}}</main>";
    }),
  };

  const data = await readDirectoryListingData(
    "/repo",
    { allowDotfiles: false, directoryTemplate: "/site/listing.html" },
    filesystem,
  );

  expect(data.entries.map((item) => item.name)).toEqual(["folder", "a.txt", "z.txt"]);
  expect(data.entries[1].stats.size).toBe(2);
  expect(data.validation).toEqual({ passed: true });
  expect(data.containerValidation).toEqual({ passed: false });
  expect(data.template).toBe("<main>{{ROWS}}</main>");
});

test("keeps entries when stats and optional files are missing", async () => {
  const filesystem = {
    readdir: jest.fn().mockResolvedValue([entry("vanished.txt"), entry(".hidden")]),
    stat: jest.fn().mockRejectedValue(new Error("entry removed")),
    readFile: jest.fn().mockRejectedValue(new Error("file missing")),
  };

  const data = await readDirectoryListingData(
    "/repo",
    { allowDotfiles: true, directoryTemplate: "/site/missing.html" },
    filesystem,
  );

  expect(data.entries.map((item) => item.name)).toEqual([".hidden", "vanished.txt"]);
  expect(data.entries[0].stats).toBeNull();
  expect(data.validation).toBeNull();
  expect(data.containerValidation).toBeNull();
  expect(data.template).toBeNull();
});

test("hides disabled symlinks and keeps only allowed links inside the repository", async () => {
  const entries = [
    {
      name: "inside-link",
      isDirectory: () => false,
      isFile: () => false,
      isSymbolicLink: () => true,
    },
    {
      name: "outside-link",
      isDirectory: () => false,
      isFile: () => false,
      isSymbolicLink: () => true,
    },
    {
      name: "special-link",
      isDirectory: () => false,
      isFile: () => false,
      isSymbolicLink: () => true,
    },
    entry("package.rpm"),
    { name: "socket", isDirectory: () => false, isFile: () => false, isSymbolicLink: () => false },
  ];
  const filesystem = {
    readdir: jest.fn(async () => entries),
    realpath: jest.fn(async (value) => {
      if (value === "/repo") return value;
      return value.endsWith("outside-link") ? "/outside/package.rpm" : value;
    }),
    stat: jest.fn(async (value) => ({
      size: 42,
      isDirectory: () => value.endsWith("inside-link"),
      isFile: () => value.endsWith("package.rpm"),
    })),
    readFile: jest.fn(async () => "<main>{{ROWS}}</main>"),
  };
  const config = {
    allowDotfiles: false,
    allowSymlinks: false,
    directoryTemplate: "/site/listing.html",
  };
  const disabled = await readDirectoryListingData("/repo", config, filesystem);
  expect(disabled.entries.map(({ name }) => name)).toEqual(["package.rpm"]);

  const allowed = await readDirectoryListingData(
    "/repo",
    { ...config, allowSymlinks: true, publicDir: "/repo" },
    filesystem,
  );
  expect(allowed.entries.map(({ name }) => name)).toEqual(["inside-link", "package.rpm"]);
  expect(allowed.entries[0].isDirectory).toBe(true);

  const unresolvedRoot = await readDirectoryListingData(
    "/repo",
    { ...config, allowSymlinks: true },
    filesystem,
  );
  expect(unresolvedRoot.entries.map(({ name }) => name)).toEqual(["package.rpm"]);
});
