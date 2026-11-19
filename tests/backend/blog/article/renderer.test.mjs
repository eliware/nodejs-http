import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/article/renderer.mjs";
const { renderBlogContent } = __moduleApi0();

test("converts Markdown and removes a duplicate leading title", () => {
  const html = renderBlogContent("# Hidden heading\n\nVisible text.");
  expect(html).not.toContain("Hidden heading");
  expect(html).toContain("Visible text.");
});
