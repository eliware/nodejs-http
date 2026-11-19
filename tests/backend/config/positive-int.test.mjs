import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/config/positive-int.mjs";
const { parsePositiveInt } = __moduleApi0();

test("accepts positive integers and falls back for invalid values", () => {
  expect(parsePositiveInt("123", 9)).toBe(123);
  expect(parsePositiveInt("0", 9)).toBe(9);
  expect(parsePositiveInt("-1", 9)).toBe(9);
  expect(parsePositiveInt("nope", 9)).toBe(9);
  expect(parsePositiveInt(undefined, 9)).toBe(9);
});
