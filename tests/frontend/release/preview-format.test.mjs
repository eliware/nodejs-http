import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/release/preview-format.mjs";
const { previewCommit, previewDate } = __moduleApi0();

test("formats preview dates and commit references", () => {
  expect(previewDate({})).toBe("Preview");
  expect(previewDate({ built: "2026-01-01T12:00:00Z" })).not.toBe("Preview");
  expect(previewCommit({ source: { commit: "abcdef0123456789" } })).toBe("abcdef012345");
  expect(previewCommit({ candidate: "build-1234567890abcd" })).toBe("1234567890ab");
  expect(previewCommit({ candidate: "build-latest" })).toBe("unknown commit");
});
