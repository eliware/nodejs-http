import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/listing-data.mjs";
const { readDirectoryListingData } = __moduleApi0();

function entry(name, directory = false) {
  return { name, isDirectory: () => directory };
}

test("reads, filters, and sorts repository entries with metadata", async () => {
  const filesystem = {
    readdir: jest
      .fn()
      .mockResolvedValue([entry("z.txt"), entry("folder", true), entry("a.txt"), entry(".hidden")]),
    stat: jest.fn(async (filePath) => ({ size: filePath.endsWith("a.txt") ? 2 : 4 })),
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
