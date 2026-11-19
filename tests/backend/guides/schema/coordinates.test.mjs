import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/guides/schema/coordinates.mjs";
const { validateGuideCoordinates } = __moduleApi0();

const guide = (overrides = {}) => ({ platform: "rpm", channel: "stable", ...overrides });

test("accepts guide coordinates that match the document", () => {
  expect(validateGuideCoordinates(guide(), "centos10", "stable")).toBeUndefined();
  expect(
    validateGuideCoordinates(guide({ platform: "debian" }), "debian12", "stable"),
  ).toBeUndefined();
});

test.each([
  [null, "centos10", "stable"],
  [guide(), "other", "stable"],
  [guide({ platform: "debian" }), "centos10", "stable"],
  [guide({ channel: "rolling" }), "centos10", "stable"],
])("rejects a document that does not match its coordinates", (value, os, channel) => {
  expect(() => validateGuideCoordinates(value, os, channel)).toThrow("invalid guide");
});
