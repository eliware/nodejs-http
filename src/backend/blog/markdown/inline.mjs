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

export default function __moduleApi0() {
  return { renderInline, escapeHtml };
}
