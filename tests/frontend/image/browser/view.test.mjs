import { expect, test } from "@jest/globals";
import { installBrowserDom } from "../../../../test-fixtures/browser-dom.mjs";
import __moduleApi0 from "../../../../src/frontend/image/browser/view.mjs";
const { renderImageBrowser } = __moduleApi0();
import imageBrowserStateApi from "../../../../src/frontend/image/browser/state.mjs";
const { createImageBrowserState } = imageBrowserStateApi();

const record = (repository) => ({
  repository,
  distro: "centos-stream",
  distroLabel: "CentOS Stream",
  release: "10",
  arch: "x86_64",
  channel: "stable",
  version: "26.13.1",
  built: "2026-01-01T00:00:00Z",
  image: { reference: `${repository}:26.13.1`, digest: "sha256:abc" },
});

function setup(records) {
  const { get, document } = installBrowserDom({
    ids: [
      "image-list",
      "image-browser-status",
      "image-browser-breadcrumbs",
      "target-distro",
      "target-channel",
      "target-version",
      "image-example-panel",
      "image-example-title",
      "image-example-code",
    ],
  });
  get("target-distro").value = "centos-stream";
  get("target-channel").value = "stable";
  get("target-version").value = "stable";
  const state = createImageBrowserState({ stable: { version: "26.13.1" } }, records);
  return { get, document, state };
}

test("renders repository folders, breadcrumbs, and image details", () => {
  const ui = setup([record("ghcr.io/eliware/nodejs"), record("ghcr.io/eliware/nodejs-alt")]);
  renderImageBrowser(ui.state);
  expect(ui.get("image-browser-status").textContent).toContain("2 repositories");
  ui.get("image-list").children[0].children[0].dispatch("click");
  expect(ui.get("image-browser-status").textContent).toBe("1 images");
  expect(ui.state.openRepository).toBe("ghcr.io/eliware/nodejs");
  ui.get("image-browser-breadcrumbs").children[0].dispatch("click");
  expect(ui.state.openRepository).toBeNull();
});

test("renders one repository and returns when required elements are missing", () => {
  const ui = setup([record("ghcr.io/eliware/nodejs")]);
  renderImageBrowser(ui.state);
  expect(ui.get("image-browser-status").textContent).toBe("1 images · 1 repositories");
  expect(ui.get("image-example-panel").hidden).toBe(false);
  installBrowserDom({ ids: ["image-list"] });
  renderImageBrowser(ui.state);
  installBrowserDom({ ids: ["image-browser-status"] });
  renderImageBrowser(ui.state);
});
