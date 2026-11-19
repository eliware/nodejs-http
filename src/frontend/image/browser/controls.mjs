import __moduleApi1 from "../../dom.mjs";
const { getElement } = __moduleApi1();
import imageExamplesApi from "../example-view.mjs";
const { renderImageExample } = imageExamplesApi();
import imageStateApi from "./state.mjs";
const { resetImageSelection, setImageExampleReferenceMode, setImageExampleKind } = imageStateApi();

function bindImageBrowserControls(state, render) {
  document.querySelectorAll("[data-image-example-reference]").forEach((button) =>
    button.addEventListener("click", () => {
      setImageExampleReferenceMode(state, button.dataset.imageExampleReference);
      renderImageExample(state.currentExample, state.exampleReferenceMode);
    }),
  );
  ["target-distro", "target-channel", "target-version"].forEach((id) =>
    getElement(id)?.addEventListener("change", () => {
      resetImageSelection(state);
      const panel = getElement("image-example-panel");
      if (panel) panel.hidden = true;
      render();
    }),
  );
  document.querySelectorAll("[data-image-example-kind]").forEach((button) =>
    button.addEventListener("click", () => {
      if (!setImageExampleKind(state, button.dataset.imageExampleKind)) return;
      renderImageExample(state.currentExample, state.exampleReferenceMode);
    }),
  );
  document.addEventListener("target-selection-ready", render);
}

export default function __moduleApi0() {
  return { bindImageBrowserControls };
}
