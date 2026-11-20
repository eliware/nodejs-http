import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/blog/date-format.mjs";
const { formatBlogDate } = __moduleApi0();

test("formats blog dates with the configured locale", () => {
  expect(formatBlogDate("2026-01-01T12:00:00Z")).toMatch(/2026/);
});
