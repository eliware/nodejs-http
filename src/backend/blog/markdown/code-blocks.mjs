import markdownInlineApi from "./inline.mjs";
const { escapeHtml } = markdownInlineApi();

function isCodeFence(line) {
  return line.startsWith("```");
}

function transitionCodeFence(line, code) {
  if (!isCodeFence(line)) return { handled: false, code, html: "" };
  if (code === null) return { handled: true, code: [], html: "" };
  return { handled: true, code: null, html: renderCodeBlock(code) };
}

function renderCodeBlock(lines) {
  return `<pre><code>${escapeHtml(lines.join("\n"))}</code></pre>`;
}

export default function __moduleApi0() {
  return { isCodeFence, transitionCodeFence, renderCodeBlock };
}
