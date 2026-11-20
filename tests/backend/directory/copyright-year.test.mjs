import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/copyright-year.mjs";
const { copyrightYear } = __moduleApi0();

test("formats the copyright year for current and future dates", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-06-01T00:00:00Z"));
  expect(copyrightYear()).toBe("2026");
  jest.setSystemTime(new Date("2028-06-01T00:00:00Z"));
  expect(copyrightYear()).toBe("2026-2028");
  jest.useRealTimers();
});
