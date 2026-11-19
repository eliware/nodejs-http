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
      "release-status",
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
        tag: "26.13.1",
        reference: "ghcr.io/eliware/centos10-node26:26.13.1",
      },
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
  expect(state.get("release-status").textContent).toContain("Latest stable release");
  expect(state.get("target-release").options[0].value).toBe("10");
  expect(state.get("target-version").options[0].value).toBe("stable");
  expect(state.get("rpm-command").textContent).toContain("eliware-node26");
  expect(state.get("image-ref").textContent).toContain("centos10-node26");
  state.manager.dispatch("click");
  state.imageReference.dispatch("click");
  state.get("target-channel").value = "stable";
  state.get("target-channel").dispatch("change");
  expect(state.get("target-version").options[0].value).toBe("stable");
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

test("uses version and generated fields from latest stable metadata", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({
    stable: { latest: { version: "26.13.2", generated: "2026-01-02T00:00:00Z" } },
  });
  await initReleaseWizard();
  expect(state.get("target-version").options[0].textContent).toContain("26.13.2");
  expect(state.get("built").textContent).not.toBe("Validated");
});

test("continues when the target release selector is absent", async () => {
  const state = setup();
  state.elements.delete("target-release");
  await initReleaseWizard();
  expect(state.get("release").textContent).toBe("26.13.1");
});

test("shows an empty stable option when release metadata has no version", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({ stable: {} });
  await initReleaseWizard();
  state.get("target-channel").dispatch("change");
  expect(state.get("target-version").options[0].textContent).toBe("No stable release available");
});

test("uses default release metadata when the catalog is empty", async () => {
  const state = setup();
  fetchCatalog.mockResolvedValue({});
  await initReleaseWizard();
  expect(state.get("release").textContent).toBe("unavailable");
  expect(state.get("built").textContent).toBe("Validated");
  state.get("target-channel").dispatch("change");
  expect(state.get("target-version").options[0].textContent).toBe("No stable release available");
});

test("shows a helpful message when release metadata fails", async () => {
  const state = setup();
  fetchCatalog.mockRejectedValue(new Error("offline"));
  await initReleaseWizard();
  expect(state.get("rpm-command").textContent).toContain("temporarily unavailable");
});

test("updates the wizard when optional release summary fields are absent", async () => {
  const state = setup();
  state.elements.delete("release");
  state.elements.delete("built");
  state.elements.delete("release-status");
  await initReleaseWizard();
  expect(state.get("rpm-command").textContent).toContain("eliware-node26");
});
