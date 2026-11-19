import { expect, jest, test } from "@jest/globals";
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

globalThis.location = { origin: "https://repo.example" };
const fetchCatalog = jest.fn();
jest.unstable_mockModule("../../../src/frontend/api.mjs", () => ({
  default: () => ({
    fetchCatalog,
    origin: "https://repo.example",
  }),
}));
const { initReleaseWizard } = (await import("../../../src/frontend/release/wizard.mjs")).default();
const { wizardState } = await import("../../../src/frontend/release/wizard/state.mjs");

function setup() {
  const manager = new BrowserElement("button");
  manager.dataset.packageManager = "dnf";
  const imageReference = new BrowserElement("button");
  imageReference.dataset.imageReference = "sha";
  const { get, document, listeners, elements } = installBrowserDom({
    ids: [
      "release",
      "target-channel",
      "target-version",
      "target-distro",
      "target-release",
      "rpm-command",
      "rpm-status",
      "package-install-title",
      "package-manager-tools",
      "package-repo-file",
      "package-repo-separator",
      "rpm-browse",
      "image-ref",
      "image-digest",
      "image-repository-link",
      "built",
      "preview-count",
      "preview-summary",
    ],
    groups: { "[data-package-manager]": [manager], "[data-image-reference]": [imageReference] },
  });
  get("target-channel").value = "stable";
  get("target-distro").value = "centos-stream";
  get("target-version").value = "stable";
  fetchCatalog.mockReset().mockResolvedValue({
    stable: {
      version: "26.13.1",
      latest: { node_version: "26.13.1" },
      built: "2026-01-01T00:00:00Z",
      image: {
        repository: "ghcr.io/eliware/centos10-node26",
        digest: "sha256:abc",
        tag: "10.1",
        reference: "ghcr.io/eliware/centos10-node26:26.13.1",
      },
    },
    preview: {
      available: true,
      items: [
        { candidate: "rolling-abcdef1234", built: "2026-01-02T00:00:00Z" },
        { candidate: "rolling-9876543210", built: "2026-01-03T00:00:00Z" },
      ],
    },
  });
  return { get, document, listeners, elements, manager, imageReference };
}

test("does nothing when required release controls are missing", async () => {
  installBrowserDom();
  await initReleaseWizard();
  expect(fetchCatalog).not.toHaveBeenCalled();
});

test("initializes stable options, package commands, and image references", async () => {
  const state = setup();
  await initReleaseWizard();
  expect(state.get("release").textContent).toBe("26.13.1");
  expect(state.get("target-release").options[0].value).toBe("10");
  expect(state.get("target-version").options[0].value).toBe("stable");
  expect(state.get("rpm-command").textContent).toContain("nodejs26");
  expect(state.get("image-ref").textContent).toContain("centos10-node26");
  state.manager.dispatch("click");
  state.imageReference.dispatch("click");
  state.get("target-channel").value = "preview";
  state.get("target-channel").dispatch("change");
  expect(state.get("target-version").options[0].value).toBe("rolling-abcdef1234");
  state.get("target-version").dispatch("change");
  state.get("target-distro").value = "centos-stream";
  state.get("target-distro").dispatch("change");
  expect(state.get("target-release").options[0].value).toBe("10");
  expect(wizardState.catalog.stable.version).toBe("26.13.1");
  state.elements.delete("image-repository-link");
  state.get("target-distro").value = "unknown";
  state.get("target-distro").dispatch("change");
});

test("formats a recorded stable build date", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({ stable: { built: "2026-01-01T00:00:00Z" } });
  await initReleaseWizard();
  expect(state.get("built").textContent).not.toBe("Validated");
});

test("continues when the target release selector is absent", async () => {
  const state = setup();
  state.elements.delete("target-release");
  await initReleaseWizard();
  expect(state.get("release").textContent).toBe("26.13.1");
});

test("shows an empty preview option when no candidate exists", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({ stable: {}, preview: { items: [] } });
  await initReleaseWizard();
  state.get("target-channel").value = "preview";
  state.get("target-channel").dispatch("change");
  expect(state.get("target-version").options[0].textContent).toBe("No builds available");
  expect(state.get("preview-count").textContent).toBe(0);
});

test("uses default release metadata when the catalog is empty", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({});
  await initReleaseWizard();
  expect(state.get("release").textContent).toBe("unavailable");
  expect(state.get("built").textContent).toBe("Validated");
  expect(state.get("preview-count").textContent).toBe(0);
  state.get("target-channel").value = "preview";
  state.get("target-channel").dispatch("change");
  expect(state.get("target-version").options[0].textContent).toBe("No builds available");
});

test("formats a single available rolling build", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({
    stable: {},
    preview: {
      available: true,
      items: [{ candidate: "rolling-abcdef1234", built: "2026-01-02T00:00:00Z" }],
      latest: { built: "2026-01-02T00:00:00Z" },
    },
  });
  await initReleaseWizard();
  expect(state.get("preview-summary").textContent).toContain("1 rolling build available");
});

test("formats an available preview without item metadata", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({ preview: { available: true } });
  await initReleaseWizard();
  expect(state.get("preview-summary").textContent).toContain("0 rolling builds available");
});

test("shows a helpful message when release metadata fails", async () => {
  const state = setup();
  fetchCatalog.mockRejectedValue(new Error("offline"));
  await initReleaseWizard();
  expect(state.get("rpm-command").textContent).toContain("temporarily unavailable");
});
