import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/markdown/inline.mjs";
const { renderInline, escapeHtml } = __moduleApi0();

test("escapes text and renders inline code and bold text", () => {
  expect(escapeHtml("&\"<>'")).toBe("&amp;&quot;&lt;&gt;&#39;");
  expect(renderInline("<tag> & \"quote\" 'apostrophe' `code` **bold**")).toBe(
    "&lt;tag&gt; &amp; &quot;quote&quot; &#39;apostrophe&#39; <code>code</code> <strong>bold</strong>",
  );
});

test("allows safe links and leaves unsafe links as text", () => {
  expect(renderInline("[Web](https://example.test) [Mail](mailto:help@example.test)")).toContain(
    'href="https://example.test"',
  );
  expect(renderInline("[Bad](javascript:alert)")).toBe("Bad");
});
