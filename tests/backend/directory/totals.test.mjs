import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/totals.mjs";
const { summarizeDirectoryTotals } = __moduleApi0();

function stats(directory, size) {
  return { isDirectory: () => directory, size };
}

test("counts files and sums their bytes, excluding directories and missing files", () => {
  expect(
    summarizeDirectoryTotals([
      { stats: stats(false, 1024) },
      { stats: stats(true, 0) },
      { stats: null },
      { stats: stats(false, 512) },
    ]),
  ).toEqual({ fileCount: 2, totalBytes: 1536 });
});

test("returns zero totals for an empty listing", () => {
  expect(summarizeDirectoryTotals([])).toEqual({ fileCount: 0, totalBytes: 0 });
});
