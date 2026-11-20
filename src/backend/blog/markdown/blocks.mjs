import markdownInlineApi from "./inline.mjs";
const { renderInline, escapeHtml } = markdownInlineApi();
import headingIdsApi from "./heading-ids.mjs";
const { createHeadingIdGenerator } = headingIdsApi();

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
    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      flushOrderedList();
      if (code === null) code = [];
      else {
        output.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
        code = null;
      }
      continue;
    }
    if (code !== null) {
      code.push(line);
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
  if (code !== null) output.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
  return output.join("\n");
}

export default function __moduleApi0() {
  return { renderMarkdown };
}
