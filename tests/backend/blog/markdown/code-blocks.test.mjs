import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/markdown/code-blocks.mjs";
const { isCodeFence, transitionCodeFence, renderCodeBlock } = __moduleApi0();

test("recognizes code fences and tracks their open and close transitions", () => {
  expect(isCodeFence("```js")).toBe(true);
  expect(isCodeFence("not a fence")).toBe(false);
  expect(transitionCodeFence("```", null)).toEqual({ handled: true, code: [], html: "" });
  expect(transitionCodeFence("```", ["const value = 1;"])).toEqual({
    handled: true,
    code: null,
    html: "<pre><code>const value = 1;</code></pre>",
  });
});

test("escapes code content and renders unclosed blocks", () => {
  expect(renderCodeBlock(["<script>", "&"])).toBe("<pre><code>&lt;script&gt;\n&amp;</code></pre>");
});
