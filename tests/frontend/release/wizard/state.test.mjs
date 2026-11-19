import { expect, test } from "@jest/globals";
import { wizardState } from "../../../../src/frontend/release/wizard/state.mjs";

test("starts the install wizard with stable package defaults", () => {
  expect(wizardState).toEqual({
    catalog: {},
    packageManager: "dnf",
    imageReferenceMode: "tag",
  });
});
