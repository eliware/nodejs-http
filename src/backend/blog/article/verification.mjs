import markdownInlineApi from "../markdown/inline.mjs";
const { escapeHtml } = markdownInlineApi();

function renderVerificationMetadata(blog) {
  return blog.last_verified_at
    ? `<p class="blog-meta">Last verified ${escapeHtml(blog.last_verified_at.slice(0, 10))} · Tested on ${escapeHtml(blog.tested_on.join(", "))}</p>`
    : "";
}

export default function __moduleApi0() {
  return { renderVerificationMetadata };
}
