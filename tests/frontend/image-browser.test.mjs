import { expect, jest, test } from "@jest/globals";
import { BrowserElement, installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

globalThis.location = { origin: "https://repo.example" };
const fetchCatalog = jest.fn();
jest.unstable_mockModule("../../src/frontend/api.mjs", () => ({
  default: () => ({ fetchCatalog }),
}));
const { initImageBrowser } = (await import("../../src/frontend/image-browser.mjs")).default();

function record(repository, version = "26.13.1") {
  return {
    distribution: "centos-stream",
    channel: "stable",
    version,
    image: { repository, reference: `${repository}:${version}`, digest: "sha256:abc" },
    built: "2026-01-01T00:00:00Z",
  };
}
function setup() {
  const referenceButton = new BrowserElement("button");
  referenceButton.dataset.imageExampleReference = "sha";
  const kindButton = new BrowserElement("button");
  kindButton.dataset.imageExampleKind = "compose";
  const state = installBrowserDom({
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
    groups: {
      "[data-image-example-reference]": [referenceButton],
      "[data-image-example-kind]": [kindButton],
    },
  });
  state.get("target-distro").value = "centos-stream";
  state.get("target-channel").value = "stable";
  state.get("target-version").value = "stable";
  fetchCatalog.mockResolvedValue({
    stable: { version: "26.13.1" },
    images: [
      record("ghcr.io/eliware/centos10-node26"),
      record("ghcr.io/eliware/centos10-node26", "26.13.0"),
      {
        ...record("ghcr.io/eliware/centos10-node26", "rolling-abcdef1234"),
        channel: "preview",
        candidate: "rolling-abcdef1234",
      },
    ],
  });
  return { ...state, referenceButton, kindButton };
}

test("does nothing when image list is missing", async () => {
  installBrowserDom();
  await initImageBrowser();
  expect(fetchCatalog).not.toHaveBeenCalled();
});

test("groups images, opens repositories, and renders examples", async () => {
  const state = setup();
  await initImageBrowser();
  expect(state.get("image-list").children).toHaveLength(1);
  expect(state.get("image-browser-status").textContent).toContain("1 images");
  state.get("image-list").children[0].dispatch("click");
  expect(state.get("image-example-panel").hidden).toBe(false);
  state.referenceButton.dispatch("click");
  state.kindButton.dispatch("click");
  expect(state.get("image-example-code").textContent).toContain("services:");
  state.get("target-distro").value = "unavailable";
  state.get("target-version").dispatch("change");
  expect(state.get("image-example-panel").hidden).toBe(true);
  state.get("target-distro").value = "centos-stream";
  state.document.dispatchEvent(new Event("target-selection-ready"));
  expect(state.get("image-browser-status").textContent).toContain("1 images");
  state.get("target-version").value = "26.13.1";
  state.get("target-version").dispatch("change");
  state.get("target-channel").value = "stable";
  state.get("target-channel").dispatch("change");
  state.get("target-version").value = "stable";
  state.get("target-version").dispatch("change");
});

test("renders an empty browser and reports unavailable metadata", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({ images: [] });
  await initImageBrowser();
  expect(state.get("image-browser-status").textContent).toContain(
    "No stable CentOS Stream 10 images",
  );
  state.get("target-distro").value = "unmatched";
  state.get("target-distro").dispatch("change");
  state.document.dispatchEvent(new Event("target-selection-ready"));
  state.kindButton.dispatch("click");
  fetchCatalog.mockRejectedValue(new Error("offline"));
  installBrowserDom({ ids: ["image-list", "image-browser-status"] });
  await initImageBrowser();
  expect(document.getElementById("image-browser-status").textContent).toContain(
    "temporarily unavailable",
  );
});

test("renders one repository and handles examples without an example panel", async () => {
  const state = installBrowserDom({
    ids: [
      "image-list",
      "image-browser-status",
      "target-distro",
      "target-channel",
      "target-version",
    ],
  });
  state.get("target-distro").value = "centos-stream";
  state.get("target-channel").value = "stable";
  state.get("target-version").value = "stable";
  fetchCatalog.mockResolvedValue({
    stable: { version: "26.13.1" },
    images: [record("ghcr.io/eliware/centos10-node26")],
  });
  await initImageBrowser();
  expect(state.get("image-browser-status").textContent).toContain("1 repositories");
  state.get("image-list").children[0].dispatch("click");
  expect(state.get("image-browser-status").textContent).toContain("1 images");
  state.get("target-version").dispatch("change");
  state.get("target-version").value = "26.13.1";
  state.get("target-version").dispatch("change");
  state.get("target-channel").value = "stable";
  state.get("target-channel").dispatch("change");
  state.get("target-version").value = "stable";
  state.get("target-version").dispatch("change");
});

test("returns when image data cannot load and the status element is missing", async () => {
  installBrowserDom({ ids: ["image-list"] });
  fetchCatalog.mockRejectedValue(new Error("offline"));
  await expect(initImageBrowser()).resolves.toBeUndefined();
});

test("returns from rendering when the image status element is missing", async () => {
  installBrowserDom({ ids: ["image-list"] });
  fetchCatalog.mockResolvedValue({ images: [] });
  await expect(initImageBrowser()).resolves.toBeUndefined();
});
