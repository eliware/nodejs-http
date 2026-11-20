import markdownInlineApi from "./inline.mjs";
const { escapeHtml } = markdownInlineApi();

function openingFence(line) {
  const match = /^( {0,3})(`{3,}|~{3,})(.*)$/.exec(line);
  if (!match || (match[2][0] === "`" && match[3].includes("`"))) return null;
  return { character: match[2][0], length: match[2].length };
}

function isCodeFence(line) {
  return openingFence(line) !== null;
}

function transitionCodeFence(line, code) {
  if (code === null) {
    const fence = openingFence(line);
    return fence
      ? { handled: true, code: { ...fence, lines: [] }, html: "" }
      : { handled: false, code, html: "" };
  }
  const closing = /^( {0,3})(`+|~+)[ \t]*$/.exec(line);
  if (closing && closing[2][0] === code.character && closing[2].length >= code.length)
    return { handled: true, code: null, html: renderCodeBlock(code.lines) };
  return { handled: false, code, html: "" };
}

function renderCodeBlock(lines) {
  return `<pre><code>${escapeHtml(lines.join("\n"))}</code></pre>`;
}

export default function __moduleApi0() {
  return { isCodeFence, transitionCodeFence, renderCodeBlock };
}
