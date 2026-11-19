import __moduleApi1 from "./api.mjs";
const { fetchCatalog } = __moduleApi1();
import __moduleApifix1 from "./dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "./format.mjs";
const { formatDateTime } = __moduleApifix2();
import __moduleApifix3 from "./image/records.mjs";
const { imageRecords } = __moduleApifix3();
import __moduleApifix4 from "./image/records.mjs";
const { displaySource } = __moduleApifix4();
import __moduleApifix5 from "./image/examples.mjs";
const { renderImageExample } = __moduleApifix5();
import __moduleApifix6 from "./image/rows.mjs";
const { renderFolderRow, renderImageRow } = __moduleApifix6();

let records = [];
let openRepository = null;
let currentExample = null;
let exampleReferenceMode = "latest";
let catalog = {};
function selectedRecords() {
  const distro = getElement("target-distro")?.value;
  const channel = getElement("target-channel")?.value;
  const version = getElement("target-version")?.value;
  const stableVersion = catalog.stable?.version;
  return records.filter(
    (record) =>
      record.distro === distro &&
      record.channel === channel &&
      (channel === "stable"
        ? record.version === (version === "stable" ? stableVersion : version)
        : record.candidate === version),
  );
}

function showExample(record, kind) {
  currentExample = { record, kind };
  renderImageExample(currentExample, exampleReferenceMode);
  const panel = getElement("image-example-panel");
  if (!panel) return;
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderBreadcrumbs() {
  const breadcrumbs = getElement("image-browser-breadcrumbs");
  if (!breadcrumbs) return;
  breadcrumbs.replaceChildren();
  const root = document.createElement("button");
  root.type = "button";
  root.className = "breadcrumb-link";
  root.textContent = "Images";
  root.addEventListener("click", () => {
    openRepository = null;
    render();
  });
  breadcrumbs.appendChild(root);
  if (openRepository) {
    const separator = document.createElement("span");
    separator.textContent = " / ";
    breadcrumbs.append(separator);
    const current = document.createElement("span");
    current.textContent = openRepository.split("/").at(-1);
    breadcrumbs.append(current);
  }
}

function render() {
  const list = getElement("image-list");
  const status = getElement("image-browser-status");
  if (!list || !status) return;
  renderBreadcrumbs();
  list.replaceChildren();
  const visible = selectedRecords();
  const repositories = [...new Set(visible.map((record) => record.repository))];
  if (!openRepository) {
    if (repositories.length > 1) {
      repositories.sort().forEach((repository) =>
        renderFolderRow(
          list,
          repository,
          () => selectedRecords().filter((record) => record.repository === repository).length,
          (value) => {
            openRepository = value;
            render();
          },
        ),
      );
    } else
      visible.forEach((record) =>
        renderImageRow(list, record, showExample, formatDateTime, displaySource),
      );
    status.textContent = `${visible.length} images · ${repositories.length} repositories`;
    if (!currentExample && visible[0]) {
      currentExample = { record: visible[0], kind: "dockerfile" };
      const panel = getElement("image-example-panel");
      if (panel) panel.hidden = false;
      renderImageExample(currentExample, exampleReferenceMode);
    }
    return;
  }
  visible
    .filter((record) => record.repository === openRepository)
    .forEach((record) => renderImageRow(list, record, showExample, formatDateTime, displaySource));
  status.textContent = `${visible.filter((record) => record.repository === openRepository).length} images`;
}

async function initImageBrowser() {
  if (!getElement("image-list")) return;
  try {
    catalog = await fetchCatalog();
    records = imageRecords(catalog);
    document.querySelectorAll("[data-image-example-reference]").forEach((button) =>
      button.addEventListener("click", () => {
        exampleReferenceMode = button.dataset.imageExampleReference;
        renderImageExample(currentExample, exampleReferenceMode);
      }),
    );
    ["target-distro", "target-channel", "target-version"].forEach((id) =>
      getElement(id)?.addEventListener("change", () => {
        openRepository = null;
        currentExample = null;
        const panel = getElement("image-example-panel");
        if (panel) panel.hidden = true;
        render();
      }),
    );
    document.querySelectorAll("[data-image-example-kind]").forEach((button) =>
      button.addEventListener("click", () => {
        if (!currentExample) return;
        currentExample.kind = button.dataset.imageExampleKind;
        renderImageExample(currentExample, exampleReferenceMode);
      }),
    );
    document.addEventListener("target-selection-ready", render);
    render();
  } catch {
    const status = getElement("image-browser-status");
    if (status) status.textContent = "Image metadata is temporarily unavailable.";
  }
}

export default function __moduleApi0() {
  return { initImageBrowser };
}
