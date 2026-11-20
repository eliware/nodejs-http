import __moduleApi1 from "./html-escaping.mjs";
const { escapeHtml } = __moduleApi1();

function renderFallbackHtml(title, rows) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>:root{color-scheme:dark}body{margin:0;background:#080d18;color:#e8eef8;font:15px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:4rem auto;padding:0 1.25rem}h1{font-size:clamp(1.5rem,4vw,2.5rem);word-break:break-all}table{width:100%;border-collapse:collapse;background:#101b2e;border:1px solid #243553;border-radius:12px;overflow:hidden}th,td{text-align:left;padding:.8rem 1rem;border-bottom:1px solid #243553}th{color:#9fb0c7;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em}tr:last-child td{border-bottom:0}tr:hover{background:#172943}a{color:#80d9ff;text-decoration:none}a:hover{text-decoration:underline}.kind{color:#74dcb9;font-size:1.25rem;text-align:center}</style></head><body><main><p><a href="/">Eliware Node.js</a></p><h1>${escapeHtml(title)}</h1><table><thead><tr><th></th><th>Name</th><th>Size</th><th>Modified</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>`;
}

export default function __moduleApi0() {
  return { renderFallbackHtml };
}
