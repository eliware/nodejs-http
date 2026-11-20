import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/article/verification.mjs";
const { renderVerificationMetadata } = __moduleApi0();

test("renders escaped verification details", () => {
  expect(
    renderVerificationMetadata({
      last_verified_at: "2026-01-03T00:00:00Z",
      tested_on: ["Linux", "Node.js"],
    }),
  ).toContain("Last verified 2026-01-03 · Tested on Linux, Node.js");
});

test("omits verification details when no check date exists", () => {
  expect(renderVerificationMetadata({})).toBe("");
});
