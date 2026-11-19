import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/shared/blog/article-markup.mjs";
const { withoutLeadingTitle } = __moduleApi0();

test("removes a leading rendered title and preserves article content", () => {
  expect(withoutLeadingTitle(' <h1 class="title">Title</h1>\n<p>Body</p> ')).toBe("<p>Body</p> ");
});

test("preserves content when it has no leading title", () => {
  expect(withoutLeadingTitle("<p>Body</p>")).toBe("<p>Body</p>");
});
