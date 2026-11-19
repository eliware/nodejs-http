import { expect, test } from "@jest/globals";
import { BrowserElement, installBrowserDom } from "../../../../test-fixtures/browser-dom.mjs";

globalThis.location = { origin: "https://repo.example" };
const commands = (
  await import("../../../../src/frontend/release/wizard/package-commands.mjs")
).default();
const { wizardState } = await import("../../../../src/frontend/release/wizard/state.mjs");

function setup(distro = "centos-stream", channel = "stable", version = "stable") {
  globalThis.location.pathname = "/install";
  const manager = new BrowserElement("button");
  manager.dataset.packageManager = "dnf";
  const reference = new BrowserElement("button");
  reference.dataset.imageReference = "sha";
  const state = installBrowserDom({
    ids: [
      "target-distro",
      "target-channel",
      "target-version",
      "package-install-title",
      "package-manager-tools",
      "package-repo-file",
      "package-repo-separator",
      "rpm-browse",
      "rpm-command",
      "rpm-status",
      "image-ref",
      "image-digest",
      "image-repository-link",
    ],
    groups: { "[data-package-manager]": [manager], "[data-image-reference]": [reference] },
  });
  state.get("target-distro").value = distro;
  state.get("target-channel").value = channel;
  state.get("target-version").value = version;
  wizardState.catalog = {
    stable: {
      version: "26.13.1",
      latest: { node_version: "26.13.1" },
      image: {
        repository: "ghcr.io/eliware/centos10-node26",
        tag: "26.13.1",
        reference: "ghcr.io/eliware/centos10-node26:26.13.1",
        digest: "sha256:stable",
      },
    },
    images: [
      {
        image: {
          repository: "ghcr.io/eliware/centos10-node26",
          tag: "26.13.1",
          reference: "ghcr.io/eliware/centos10-node26:26.13.1",
          digest: "sha256:centos",
        },
        channel: "stable",
        version: "26.13.1",
      },
    ],
  };
  return state;
}

test("builds Node.js 26 DNF commands", () => {
  const state = setup();
  commands.setPackageManager("dnf");
  commands.updateCommand();
  expect(state.get("package-install-title").textContent).toBe("Install with DNF");
  expect(state.get("package-manager-tools").hidden).toBe(false);
  expect(state.get("rpm-command").textContent).toContain("eliware-node26");
  expect(state.get("rpm-command").textContent).toContain("nodejs26.repo");
});

test("builds YUM update commands for the stable lane", () => {
  const state = setup("centos-stream", "stable", "stable");
  commands.setPackageManager("yum");
  expect(state.get("package-install-title").textContent).toBe("Install with YUM");
  expect(state.get("package-manager-tools").hidden).toBe(false);
  expect(state.get("rpm-command").textContent).toContain("yum install -y eliware-node26");
  expect(state.get("rpm-status").textContent).toContain("CentOS Stream 10");
});

test("builds stable upgrade commands on the upgrade page", () => {
  const state = setup();
  commands.setPackageManager("dnf");
  globalThis.location.pathname = "/upgrade";
  commands.updateCommand();
  expect(state.get("package-install-title").textContent).toBe("Update with DNF");
  expect(state.get("rpm-command").textContent).toContain("dnf update -y eliware-node26");
  globalThis.location.pathname = "/install";
});

test("uses the latest stable image and applies manager button state", () => {
  const state = setup("centos-stream", "stable", "stable");
  commands.setPackageManager("dnf");
  expect(state.get("rpm-command").textContent).toContain("eliware-node26");
  expect(
    state.document.querySelectorAll("[data-package-manager]")[0].classList.contains("active"),
  ).toBe(true);
});

test("uses the stable Node.js repository file", () => {
  const state = setup("centos-stream", "stable", "26.13.1");
  globalThis.location.pathname = "/install";
  commands.updateCommand();
  expect(state.get("rpm-command").textContent).toContain(
    "curl -fsSLo /etc/yum.repos.d/nodejs26.repo https://repo.example/nodejs26.repo",
  );
});

test("uses default commands when optional controls and image metadata are absent", () => {
  const state = installBrowserDom({
    ids: ["target-distro", "target-channel", "target-version", "rpm-command", "rpm-status"],
  });
  state.get("target-distro").value = "unknown";
  state.get("target-channel").value = "stable";
  state.get("target-version").value = "stable";
  wizardState.catalog = { images: [{}] };
  commands.updateCommand();
  expect(state.get("rpm-command").textContent).toContain("eliware-node26");
});

test("updates only the available package output controls", () => {
  const commandOnly = installBrowserDom({
    ids: ["target-distro", "target-channel", "target-version", "rpm-command"],
  });
  commandOnly.get("target-distro").value = "centos-stream";
  commandOnly.get("target-channel").value = "stable";
  commandOnly.get("target-version").value = "stable";
  wizardState.catalog = { stable: {} };
  commands.updateCommand();

  const statusOnly = installBrowserDom({
    ids: ["target-distro", "target-channel", "target-version", "rpm-status"],
  });
  statusOnly.get("target-distro").value = "centos-stream";
  statusOnly.get("target-channel").value = "stable";
  statusOnly.get("target-version").value = "stable";
  wizardState.catalog = { stable: {} };
  commands.updateCommand();
});
