import __moduleApi1 from "./api.mjs";
const { fetchCatalog } = __moduleApi1();
import __moduleApifix1 from "./dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "./image/records.mjs";
const { imageRecords } = __moduleApifix2();
import browserStateApi from "./image/browser/state.mjs";
const { createImageBrowserState } = browserStateApi();
import browserViewApi from "./image/browser/view.mjs";
const { renderImageBrowser } = browserViewApi();
import browserControlsApi from "./image/browser/controls.mjs";
const { bindImageBrowserControls } = browserControlsApi();

async function initImageBrowser() {
  if (!getElement("image-list")) return;
  try {
    const catalog = await fetchCatalog();
    const state = createImageBrowserState(catalog, imageRecords(catalog));
    const render = () => renderImageBrowser(state);
    bindImageBrowserControls(state, render);
    render();
  } catch {
    const status = getElement("image-browser-status");
    if (status) status.textContent = "Image metadata is temporarily unavailable.";
  }
}

export default function __moduleApi0() {
  return { initImageBrowser };
}
