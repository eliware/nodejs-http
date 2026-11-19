import imageSelectionApi from "../selection.mjs";
const { selectImageRecords } = imageSelectionApi();

function createImageBrowserState(catalog, records) {
  return {
    catalog,
    records,
    openRepository: null,
    currentExample: null,
    exampleReferenceMode: "latest",
  };
}

function selectedImageRecords(state, distro, channel, version) {
  return selectImageRecords(state.records, state.catalog, distro, channel, version);
}

function resetImageSelection(state) {
  state.openRepository = null;
  state.currentExample = null;
}

function setOpenRepository(state, repository) {
  state.openRepository = repository;
}

function setCurrentExample(state, record, kind) {
  state.currentExample = { record, kind };
}

function setImageExampleReferenceMode(state, mode) {
  state.exampleReferenceMode = mode;
}

function setImageExampleKind(state, kind) {
  if (!state.currentExample) return false;
  state.currentExample.kind = kind;
  return true;
}

export default function __moduleApi0() {
  return {
    createImageBrowserState,
    selectedImageRecords,
    resetImageSelection,
    setOpenRepository,
    setCurrentExample,
    setImageExampleReferenceMode,
    setImageExampleKind,
  };
}
