import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/blog/markdown.mjs";
const { renderBlogArticle } = __moduleApi0();

test("renders a complete blog article body from Markdown", () => {
  expect(
    renderBlogArticle({ content: "# Release\n\nRead the [guide](https://example.test)." }),
  ).toBe(
    '<h1 id="release">Release</h1>\n<p>Read the <a href="https://example.test" rel="noreferrer">guide</a>.</p>',
  );
});
