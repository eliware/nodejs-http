import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/article/escaping.mjs";
const { escapeAttribute, escapeHtml } = __moduleApi0();

test("escapes attribute characters and preserves plain text", () => {
  expect(escapeAttribute('&"<>')).toBe("&amp;&quot;&lt;&gt;");
  expect(escapeAttribute("plain")).toBe("plain");
  expect(escapeHtml("&<>'\" ")).toBe("&amp;&lt;&gt;&#39;&quot; ");
});
