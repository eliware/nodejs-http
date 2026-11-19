import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/directory/validation/status.mjs";
const { metadataStatus, validationIcon } = __moduleApi0();

test("renders validation states and reads metadata status", () => {
  expect(validationIcon("passed")).toContain("validation-pass");
  expect(validationIcon("failed")).toContain("validation-fail");
  expect(validationIcon("unknown")).toContain("validation-skip");
  expect(metadataStatus("passed")).toBe("passed");
  expect(metadataStatus({ status: "failed" })).toBe("failed");
  expect(metadataStatus(null)).toBeUndefined();
});
