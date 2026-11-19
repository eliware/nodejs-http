function withoutLeadingTitle(html) {
  return String(html).replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, "");
}

export default function __moduleApi0() {
  return { withoutLeadingTitle };
}
