import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/byte-format.mjs";
const { formatBytes } = __moduleApi0();

test("formats byte lengths across units", () => {
  expect(formatBytes(12)).toBe("12 B");
  expect(formatBytes(1024)).toBe("1.0 KiB");
  expect(formatBytes(15 * 1024)).toBe("15 KiB");
  expect(formatBytes(1024 ** 2)).toBe("1.0 MiB");
  expect(formatBytes(1024 ** 5)).toContain("TiB");
});
