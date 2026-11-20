import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/sitemap/xml.mjs";
const { escapeXml } = __moduleApi0();

test("escapes XML text characters", () => {
  expect(escapeXml(`'"&<>`)).toBe("&apos;&quot;&amp;&lt;&gt;");
});
