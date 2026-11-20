import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/html-escaping.mjs";
const { escapeHtml } = __moduleApi0();

test("escapes HTML characters", () => {
  expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  expect(escapeHtml("plain")).toBe("plain");
});
