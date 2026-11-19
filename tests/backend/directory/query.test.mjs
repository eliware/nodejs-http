import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/query.mjs";
const { queryDirectoryEntries } = __moduleApi0();

const entries = [
  { name: "z.rpm", type: "file", size: 8, modified: "2026-02-01" },
  { name: "a.rpm", type: "file", size: 2, modified: "2026-01-01" },
  { name: "x86_64", type: "directory" },
  { name: "no-size.rpm", type: "file" },
];

test("filters names, sorts entries, and paginates results", () => {
  expect(
    queryDirectoryEntries(entries, {
      query: "RPM",
      sort: "size",
      order: "desc",
      offset: 1,
      limit: 1,
    }),
  ).toEqual({
    entries: [entries[1]],
    total: 3,
    offset: 1,
    limit: 1,
    hasMore: true,
  });
  expect(queryDirectoryEntries(entries, { sort: "modified", order: "desc" }).entries[0]).toBe(
    entries[0],
  );
  expect(queryDirectoryEntries(entries).entries).toEqual([
    entries[2],
    entries[1],
    entries[3],
    entries[0],
  ]);
});

test("uses bounded defaults for invalid pagination values", () => {
  const page = queryDirectoryEntries(entries, {
    query: "  ",
    sort: "name",
    offset: "invalid",
    limit: "0",
  });
  expect(page).toEqual({
    entries: [entries[2], entries[1], entries[3], entries[0]],
    total: 4,
    offset: 0,
    limit: 500,
    hasMore: false,
  });
  expect(queryDirectoryEntries(entries, { offset: -10, limit: 900 }).limit).toBe(500);
  expect(queryDirectoryEntries(entries, { offset: 4, limit: 1 }).entries).toEqual([]);
});
