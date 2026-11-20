import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/blog/categories.mjs";
const { renderBlogCategories } = __moduleApi0();
import { installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

test("adds unique escaped category options in alphabetical order", () => {
  const { get } = installBrowserDom({ ids: ["blog-category"] });
  const category = get("blog-category");
  renderBlogCategories(
    [{ category: "updates" }, { category: "guides <all>" }, { category: "updates" }],
    category,
    "updates",
  );
  expect(category.innerHTML).toBe(
    '<option value="guides &lt;all&gt;">guides &lt;all&gt;</option><option value="updates">updates</option>',
  );
  expect(category.value).toBe("updates");
});

test("skips category setup when the control is absent", () => {
  expect(() => renderBlogCategories([], null, "")).not.toThrow();
});
