function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(value) {
  return /^(?:https?:\/\/|mailto:)/i.test(value) ? value : null;
}

function renderInline(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const decodedUrl = url.replaceAll("&amp;", "&");
    const safe = safeUrl(decodedUrl);
    return safe ? `<a href="${escapeHtml(safe)}" rel="noreferrer">${text}</a>` : text;
  });
  return html;
}

function renderMarkdown(markdown) {
  const lines = String(markdown).replaceAll("\r\n", "\n").split("\n");
  const output = [];
  let paragraph = [];
  let list = [];
  let orderedList = [];
  let code = null;
  const headingIds = new Map();
  const slugify = (value) => {
    const base =
      String(value)
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "section";
    const count = headingIds.get(base) || 0;
    headingIds.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };

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
      output.push(`<h${level} id="${slugify(heading[2])}">${renderInline(heading[2])}</h${level}>`);
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

function renderBlogArticle(blog) {
  return renderMarkdown(blog.content);
}

export default function __moduleApi0() {
  return { renderMarkdown, renderBlogArticle };
}
