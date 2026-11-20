import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/article/attribute-escaping.mjs";
const { escapeAttribute } = __moduleApi0();

test("escapes attribute characters and preserves plain text", () => {
  expect(escapeAttribute('&"<>')).toBe("&amp;&quot;&lt;&gt;");
  expect(escapeAttribute("plain")).toBe("plain");
});
