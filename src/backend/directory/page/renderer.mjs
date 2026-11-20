import __moduleApi1 from "../fallback.mjs";
const { renderFallbackHtml } = __moduleApi1();
import __moduleApi2 from "../template.mjs";
const { renderDirectoryTemplate } = __moduleApi2();

function renderDirectoryPage(template, title, rows, values) {
  if (!template) return renderFallbackHtml(title, rows);
  return renderDirectoryTemplate(template, values);
}

export default function __moduleApi0() {
  return { renderDirectoryPage };
}
