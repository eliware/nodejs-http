import markdownInlineApi from "./inline.mjs";
const { renderInline } = markdownInlineApi();
import headingIdsApi from "./heading-ids.mjs";
const { createHeadingIdGenerator } = headingIdsApi();
import codeBlocksApi from "./code-blocks.mjs";
const { transitionCodeFence, renderCodeBlock } = codeBlocksApi();

function renderMarkdown(markdown) {
  const lines = String(markdown).replaceAll("\r\n", "\n").split("\n");
  const output = [];
  let paragraph = [];
  let list = [];
  let orderedList = [];
  let code = null;
  const headingId = createHeadingIdGenerator();

  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      output.push(`<ul>${list.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      list = [];
    }
  };
  const flushOrderedList = () => {
    if (orderedList.length) {
      output.push(
        `<ol>${orderedList.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`,
      );
      orderedList = [];
    }
  };

  for (const line of lines) {
    const codeFence = transitionCodeFence(line, code);
    if (codeFence.handled) {
      flushParagraph();
      flushList();
      flushOrderedList();
      code = codeFence.code;
      if (codeFence.html) output.push(codeFence.html);
      continue;
    }
    if (code !== null) {
      code.lines.push(line);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushOrderedList();
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      output.push(
        `<h${level} id="${headingId(heading[2])}">${renderInline(heading[2])}</h${level}>`,
      );
      continue;
    }
    const item = /^[-*]\s+(.+)$/.exec(line);
    if (item) {
      flushParagraph();
      flushOrderedList();
      list.push(item[1]);
      continue;
    }
    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      flushParagraph();
      flushList();
      orderedList.push(ordered[1]);
      continue;
    }
    flushList();
    flushOrderedList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  flushOrderedList();
  if (code !== null) output.push(renderCodeBlock(code.lines));
  return output.join("\n");
}

export default function __moduleApi0() {
  return { renderMarkdown };
}
