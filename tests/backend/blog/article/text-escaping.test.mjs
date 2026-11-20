import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/article/text-escaping.mjs";
const { escapeHtml } = __moduleApi0();

test("escapes HTML text and preserves plain text", () => {
  expect(escapeHtml("&<>'\" ")).toBe("&amp;&lt;&gt;&#39;&quot; ");
  expect(escapeHtml("plain")).toBe("plain");
});
