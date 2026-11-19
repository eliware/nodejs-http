import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/markdown/blocks.mjs";
const { renderMarkdown } = __moduleApi0();

test("closes paragraphs and lists before headings and code blocks", () => {
  const html = renderMarkdown("Text\ncontinued\n\n- item\n\n## Heading\n\n```\ncode\n```");
  expect(html).toContain("<p>Text continued</p>");
  expect(html).toContain("<ul><li>item</li></ul>");
  expect(html).toContain('<h2 id="heading">Heading</h2>');
  expect(html).toContain("<pre><code>code</code></pre>");
});

test("closes an empty and unclosed code block safely", () => {
  expect(renderMarkdown("```\n```")).toBe("<pre><code></code></pre>");
  expect(renderMarkdown("```\nopen")).toBe("<pre><code>open</code></pre>");
  expect(renderMarkdown("# !!!")).toContain('id="section"');
});
