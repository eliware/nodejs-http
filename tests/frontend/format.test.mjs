import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/frontend/format.mjs";
const { formatBytes, formatDateTime, previewCommit, previewDate } = __moduleApi0();

test.each([
  [0, "0 B"],
  [1023, "1023 B"],
  [1024, "1.0 KiB"],
  [15360, "15 KiB"],
  [1048576, "1.0 MiB"],
])("formats %i bytes", (value, expected) => expect(formatBytes(value)).toBe(expected));

test("formats date values and handles invalid or absent values", () => {
  expect(formatDateTime(null)).toBe("unknown time");
  expect(formatDateTime("invalid")).toBe("unknown time");
  expect(formatDateTime("2026-01-01T12:00:00Z")).not.toBe("unknown time");
});

test("formats preview dates and commit references", () => {
  expect(previewDate({})).toBe("Preview");
  expect(previewDate({ built: "2026-01-01T12:00:00Z" })).not.toBe("Preview");
  expect(previewCommit({ source: { commit: "abcdef0123456789" } })).toBe("abcdef012345");
  expect(previewCommit({ candidate: "build-1234567890abcd" })).toBe("1234567890ab");
  expect(previewCommit({ candidate: "build-latest" })).toBe("unknown commit");
});
