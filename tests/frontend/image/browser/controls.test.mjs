import { expect, jest, test } from "@jest/globals";
import { BrowserElement, installBrowserDom } from "../../../../test-fixtures/browser-dom.mjs";
import __moduleApi0 from "../../../../src/frontend/image/browser/controls.mjs";
const { bindImageBrowserControls } = __moduleApi0();
import imageBrowserStateApi from "../../../../src/frontend/image/browser/state.mjs";
const { createImageBrowserState } = imageBrowserStateApi();

const record = {
  repository: "ghcr.io/eliware/centos10-node26",
  image: {
    repository: "ghcr.io/eliware/centos10-node26",
    reference: "ghcr.io/eliware/centos10-node26:26.13.1",
    digest: "sha256:abc",
  },
};

function controls() {
  const reference = new BrowserElement("button");
  reference.dataset.imageExampleReference = "sha";
  const kind = new BrowserElement("button");
  kind.dataset.imageExampleKind = "compose";
  return {
    reference,
    kind,
    ...installBrowserDom({
      ids: [
        "target-distro",
        "target-channel",
        "target-version",
        "image-example-panel",
        "image-example-title",
        "image-example-code",
      ],
      groups: {
        "[data-image-example-reference]": [reference],
        "[data-image-example-kind]": [kind],
      },
    }),
  };
}

test("handles example controls and resets the current selection", () => {
  const ui = controls();
  const state = createImageBrowserState({}, []);
  state.currentExample = { record, kind: "dockerfile" };
  state.openRepository = "repo";
  const render = jest.fn();
  bindImageBrowserControls(state, render);

  ui.reference.dispatch("click");
  expect(state.exampleReferenceMode).toBe("sha");
  expect(ui.get("image-example-code").textContent).toContain("@sha256:abc");
  ui.kind.dispatch("click");
  expect(state.currentExample.kind).toBe("compose");
  expect(ui.get("image-example-code").textContent).toContain("services:");
  ui.get("target-version").dispatch("change");
  expect(state.currentExample).toBeNull();
  expect(state.openRepository).toBeNull();
  expect(ui.get("image-example-panel").hidden).toBe(true);
  ui.document.dispatchEvent(new Event("target-selection-ready"));
  expect(render).toHaveBeenCalledTimes(2);
});

test("ignores example-kind clicks when no image is selected", () => {
  const ui = controls();
  const state = createImageBrowserState({}, []);
  bindImageBrowserControls(state, jest.fn());
  ui.kind.dispatch("click");
  expect(state.currentExample).toBeNull();
});
