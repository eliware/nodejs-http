import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
function exampleReference(record, exampleReferenceMode) {
  if (exampleReferenceMode === "sha") return `${record.image.repository}@${record.image.digest}`;
  return record.image.reference;
}

function exampleFor(record, kind, exampleReferenceMode) {
  const ref = exampleReference(record, exampleReferenceMode);
  if (kind === "dockerfile")
    return `FROM ${ref}\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nCMD ["node", "app.mjs"]\n`;
  if (kind === "compose")
    return `services:\n  app:\n    build: .\n    image: my-node-app:local\n    restart: unless-stopped\n    read_only: true\n    security_opt:\n      - no-new-privileges:true\n`;
  return `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: app\n  template:\n    metadata:\n      labels:\n        app: app\n    spec:\n      containers:\n        - name: app\n          image: my-node-app:local\n          securityContext:\n            runAsNonRoot: true\n            allowPrivilegeEscalation: false\n            readOnlyRootFilesystem: true\n            capabilities:\n              drop: ["ALL"]\n`;
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
