import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "./examples.mjs";
const { exampleFor } = __moduleApifix1();

function renderImageExample(currentExample, exampleReferenceMode) {
  if (!currentExample) return;
  const panel = getElement("image-example-panel");
  const title = getElement("image-example-title");
  const code = getElement("image-example-code");
  if (!panel || !title || !code) return;
  const { record, kind } = currentExample;
  title.textContent = `${kind === "dockerfile" ? "Dockerfile" : kind === "compose" ? "Compose" : "Kubernetes"} · ${record.repository.split("/").at(-1)}`;
  code.textContent = exampleFor(record, kind, exampleReferenceMode);
  document.querySelectorAll("[data-image-example-reference]").forEach((button) => {
    const active = button.dataset.imageExampleReference === exampleReferenceMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-image-example-kind]").forEach((button) => {
    const active = button.dataset.imageExampleKind === kind;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

export default function __moduleApi0() {
  return { renderImageExample };
}
