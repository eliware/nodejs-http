import { expect, test } from "@jest/globals";

const modulePromise = import("../../../src/backend/blog/markdown.mjs").then((module) =>
  module.default(),
);

test("renders inline links and repeated heading names", async () => {
  const moduleUnderTest = await modulePromise;
  const html = moduleUnderTest.renderMarkdown(
    "# Same\n\n# Same\n\n# !!!\n\n[Safe](https://example.test?a=1&amp;b=2) [Unsafe](javascript:alert(1))",
  );
  expect(html).toContain('id="same-2"');
  expect(html).toContain("https://example.test?a=1&amp;amp;b=2");
  expect(html).toContain('id="section"');
  expect(html).toContain("Unsafe");
});
