import { expect, test } from "@jest/globals";

const modulePromise = import("../../../src/backend/blog/markdown.mjs").then((module) =>
  module.default(),
);

test("renders Markdown headings, lists, and code blocks", async () => {
  const { renderMarkdown } = await modulePromise;
  const html = renderMarkdown("# One\n## Two\n### Three\n\n- first\n* second\n\n```\n<value>\n```");
  expect(html).toContain('<h1 id="one">One</h1>');
  expect(html).toContain('<h2 id="two">Two</h2>');
  expect(html).toContain('<h3 id="three">Three</h3>');
  expect(html).not.toContain("<ol>");
  expect(html).toContain("<ul><li>first</li><li>second</li></ul>");
  expect(html).toContain("<pre><code>&lt;value&gt;");
});

test("creates unique anchors for repeated headings", async () => {
  expect((await modulePromise).renderMarkdown("# Repeat\n\n# Repeat")).toContain('id="repeat-2"');
});

test("renders ordered lists", async () => {
  expect((await modulePromise).renderMarkdown("1. first\n2. second")).toContain(
    "<ol><li>first</li><li>second</li></ol>",
  );
});

test("normalizes CRLF between block paragraphs", async () => {
  const html = (await modulePromise).renderMarkdown("text\r\n\r\nmore");
  expect(html).toContain("<p>text</p>");
  expect(html).toContain("<p>more</p>");
});

test("escapes code block text and closes an unclosed code block", async () => {
  const html = (await modulePromise).renderMarkdown("```\nunsafe <value>");
  expect(html).toContain("<pre><code>unsafe &lt;value&gt;");
});
