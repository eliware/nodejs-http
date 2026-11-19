import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/presentation.mjs";
const { copyrightYear, escapeHtml, formatBytes } = __moduleApi0();

test("escapes HTML and formats byte lengths across units", () => {
  expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  expect(escapeHtml("plain")).toBe("plain");
  expect(formatBytes(12)).toBe("12 B");
  expect(formatBytes(1024)).toBe("1.0 KiB");
  expect(formatBytes(15 * 1024)).toBe("15 KiB");
  expect(formatBytes(1024 ** 2)).toBe("1.0 MiB");
  expect(formatBytes(1024 ** 5)).toContain("TiB");
});

test("formats the copyright year for current and future dates", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-06-01T00:00:00Z"));
  expect(copyrightYear()).toBe("2026");
  jest.setSystemTime(new Date("2028-06-01T00:00:00Z"));
  expect(copyrightYear()).toBe("2026-2028");
  jest.useRealTimers();
});
