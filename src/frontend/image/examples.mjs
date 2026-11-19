import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
function exampleReference(record, exampleReferenceMode) {
  if (exampleReferenceMode === "sha") return `${record.image.repository}@${record.image.digest}`;
  if (exampleReferenceMode === "tag") return record.image.reference;
  return `${record.image.repository}:latest`;
}

function exampleFor(record, kind, exampleReferenceMode) {
  const ref = exampleReference(record, exampleReferenceMode);
  if (kind === "dockerfile")
    return `FROM ${ref}\n\n# Add your application and configuration here.\nCMD ["node", "-N"]\n`;
  if (kind === "compose")
    return `services:\n  nodejs:\n    image: ${ref}\n    privileged: true\n    restart: unless-stopped\n    volumes:\n      - nodejs-data:/data\n\nvolumes:\n  nodejs-data:\n`;
  return `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nodejs\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: nodejs\n  template:\n    metadata:\n      labels:\n        app: nodejs\n    spec:\n      containers:\n        - name: nodejs\n          image: ${ref}\n          securityContext:\n            privileged: true\n`;
}

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
