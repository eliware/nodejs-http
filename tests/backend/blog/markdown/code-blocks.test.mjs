import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/markdown/code-blocks.mjs";
const { isCodeFence, transitionCodeFence, renderCodeBlock } = __moduleApi0();

test("recognizes code fences and tracks their open and close transitions", () => {
  expect(isCodeFence("```js")).toBe(true);
  expect(isCodeFence("text ``` inline")).toBe(false);
  expect(isCodeFence("not a fence")).toBe(false);
  const opening = transitionCodeFence("```js", null);
  expect(opening).toEqual({
    handled: true,
    code: { character: "`", length: 3, lines: [] },
    html: "",
  });
  expect(transitionCodeFence("``` trailing text", opening.code)).toEqual({
    handled: false,
    code: opening.code,
    html: "",
  });
  expect(transitionCodeFence("```` code", opening.code)).toEqual({
    handled: false,
    code: opening.code,
    html: "",
  });
  expect(transitionCodeFence("```", { ...opening.code, lines: ["const value = 1;"] })).toEqual({
    handled: true,
    code: null,
    html: "<pre><code>const value = 1;</code></pre>",
  });
});

test("keeps backtick runs inside code until a valid closing fence", () => {
  const code = { character: "`", length: 3, lines: [] };
  expect(transitionCodeFence("```` unfinished", code).handled).toBe(false);
  expect(transitionCodeFence("~~~", code).handled).toBe(false);
  expect(transitionCodeFence("````", code)).toMatchObject({ handled: true, code: null });
});

test("escapes code content and renders unclosed blocks", () => {
  expect(renderCodeBlock(["<script>", "&"])).toBe("<pre><code>&lt;script&gt;\n&amp;</code></pre>");
});
