import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/fallback.mjs";
const { renderFallbackHtml } = __moduleApi0();

test("renders escaped fallback directory pages", () => {
  const html = renderFallbackHtml("Index of /<private>", "<tr>safe row</tr>");
  expect(html).toContain("<!doctype html>");
  expect(html).toContain("Index of /&lt;private&gt;");
  expect(html).toContain("<tr>safe row</tr>");
});
