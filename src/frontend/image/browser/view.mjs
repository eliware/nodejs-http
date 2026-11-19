import __moduleApi1 from "../../dom.mjs";
const { getElement } = __moduleApi1();
import imageRowsApi from "../rows.mjs";
const { renderFolderRow, renderImageRow } = imageRowsApi();
import imageExamplesApi from "../examples.mjs";
const { renderImageExample } = imageExamplesApi();
import imageRecordsApi from "../records.mjs";
const { displaySource } = imageRecordsApi();
import __moduleApifix1 from "../../format.mjs";
const { formatDateTime } = __moduleApifix1();
import imageStateApi from "./state.mjs";
const { selectedImageRecords, setOpenRepository, setCurrentExample } = imageStateApi();

function showExample(state, record, kind) {
  setCurrentExample(state, record, kind);
  renderImageExample(state.currentExample, state.exampleReferenceMode);
  const panel = getElement("image-example-panel");
  if (!panel) return;
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderBreadcrumbs(state, render) {
  const breadcrumbs = getElement("image-browser-breadcrumbs");
  if (!breadcrumbs) return;
  breadcrumbs.replaceChildren();
  const root = document.createElement("button");
  root.type = "button";
  root.className = "breadcrumb-link";
  root.textContent = "Images";
  root.addEventListener("click", () => {
    setOpenRepository(state, null);
    render();
  });
  breadcrumbs.appendChild(root);
  if (state.openRepository) {
    const separator = document.createElement("span");
    separator.textContent = " / ";
    breadcrumbs.append(separator);
    const current = document.createElement("span");
    current.textContent = state.openRepository.split("/").at(-1);
    breadcrumbs.append(current);
  }
}

function selectedRecords(state) {
  return selectedImageRecords(
    state,
    getElement("target-distro")?.value,
    getElement("target-channel")?.value,
    getElement("target-version")?.value,
  );
}

function renderImageBrowser(state) {
  const list = getElement("image-list");
  const status = getElement("image-browser-status");
  if (!list || !status) return;
  const render = () => renderImageBrowser(state);
  renderBreadcrumbs(state, render);
  list.replaceChildren();
  const visible = selectedRecords(state);
  const repositories = [...new Set(visible.map((record) => record.repository))];
  if (!state.openRepository) {
    if (repositories.length > 1) {
      repositories.sort().forEach((repository) =>
        renderFolderRow(
          list,
          repository,
          () => selectedRecords(state).filter((record) => record.repository === repository).length,
          (value) => {
            setOpenRepository(state, value);
            render();
          },
        ),
      );
    } else
      visible.forEach((record) =>
        renderImageRow(
          list,
          record,
          (value, kind) => showExample(state, value, kind),
          formatDateTime,
          displaySource,
        ),
      );
    status.textContent = `${visible.length} images · ${repositories.length} repositories`;
    if (!state.currentExample && visible[0]) {
      setCurrentExample(state, visible[0], "dockerfile");
      const panel = getElement("image-example-panel");
      if (panel) panel.hidden = false;
      renderImageExample(state.currentExample, state.exampleReferenceMode);
    }
    return;
  }
  const openRecords = visible.filter((record) => record.repository === state.openRepository);
  openRecords.forEach((record) =>
    renderImageRow(
      list,
      record,
      (value, kind) => showExample(state, value, kind),
      formatDateTime,
      displaySource,
    ),
  );
  status.textContent = `${openRecords.length} images`;
}

export default function __moduleApi0() {
  return { renderImageBrowser };
}
