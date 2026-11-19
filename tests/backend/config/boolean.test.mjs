import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/config/boolean.mjs";
const { parseBoolean } = __moduleApi0();

test("parses supported boolean values and preserves the fallback", () => {
  for (const value of ["1", "true", "yes", "on", "TRUE"]) {
    expect(parseBoolean(value, false)).toBe(true);
  }
  for (const value of ["0", "false", "no", "off"]) {
    expect(parseBoolean(value, true)).toBe(false);
  }
  expect(parseBoolean("unknown", true)).toBe(true);
  expect(parseBoolean(" YES ", false)).toBe(false);
});
