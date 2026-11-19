import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/guides/coordinates.mjs";
const { validateGuideCoordinate } = __moduleApi0();

const guide = { platform: "rpm", channel: "stable" };

test("accepts matching guide coordinates", () => {
  expect(validateGuideCoordinate(guide, "centos10", "stable")).toBe(guide);
  expect(
    validateGuideCoordinate({ platform: "debian", channel: "rolling" }, "debian12", "rolling"),
  ).toMatchObject({ platform: "debian", channel: "rolling" });
});

test.each([
  [guide, "other", "stable"],
  [guide, "debian12", "stable"],
  [{ platform: "rpm", channel: "rolling" }, "centos10", "stable"],
])("rejects guide coordinates that do not match", (value, os, channel) => {
  expect(() => validateGuideCoordinate(value, os, channel)).toThrow("invalid guide");
});
