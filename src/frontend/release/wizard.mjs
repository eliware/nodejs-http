import __moduleApi1 from "../api.mjs";
const { fetchCatalog } = __moduleApi1();
import __moduleApifix1 from "../dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "../format.mjs";
const { formatDateTime } = __moduleApifix2();
import { wizardState } from "./wizard/state.mjs";
import { distroTargets } from "./wizard/targets.mjs";
import __commands from "./wizard/commands.mjs";
const { setImageReferenceMode, setPackageManager, updateCommand, updateContainerCommand } =
  __commands();

function targetConfig() {
  return distroTargets[getElement("target-distro")?.value] || distroTargets["centos-stream"];
}

function setTargetReleaseOptions() {
  const release = getElement("target-release");
  if (!release) return;
  const target = targetConfig();
  release.replaceChildren();
  const option = document.createElement("option");
  option.value = target.release;
  option.textContent = target.release;
  release.appendChild(option);
}

function setVersionOptions() {
  const version = getElement("target-version");
  const stable = wizardState.catalog.stable?.latest || wizardState.catalog.stable;
  version.replaceChildren();
  const option = document.createElement("option");
  option.value = "stable";
  option.textContent =
    stable?.node_version || stable?.version
      ? `Latest stable (${stable.node_version || stable.version})`
      : "No stable release available";
  version.appendChild(option);
  updateCommand();
  updateContainerCommand();
}

function updateReleaseSummary(data) {
  const stable = data.stable?.latest || data.stable || {};
  const releaseVersion = stable.node_version || stable.version || "unavailable";
  const release = getElement("release");
  if (release) release.textContent = releaseVersion;
  const built = getElement("built");
  if (built)
    built.textContent =
      stable.built || stable.generated
        ? formatDateTime(stable.built || stable.generated)
        : "Validated";
  const status = getElement("release-status");
  if (status) status.textContent = `Latest stable release: Node.js ${releaseVersion}.`;
}

async function initReleaseWizard() {
  if (!getElement("target-channel") || !getElement("target-version")) return;
  document
    .querySelectorAll("[data-package-manager]")
    .forEach((button) =>
      button.addEventListener("click", () => setPackageManager(button.dataset.packageManager)),
    );
  document
    .querySelectorAll("[data-image-reference]")
    .forEach((button) =>
      button.addEventListener("click", () => setImageReferenceMode(button.dataset.imageReference)),
    );
  setPackageManager("dnf");
  setImageReferenceMode("tag");
  setTargetReleaseOptions();
  getElement("target-channel").addEventListener("change", setVersionOptions);
  getElement("target-distro").addEventListener("change", () => {
    setTargetReleaseOptions();
    updateCommand();
    updateContainerCommand();
  });
  getElement("target-version").addEventListener("change", () => {
    updateCommand();
    updateContainerCommand();
  });
  try {
    wizardState.catalog = await fetchCatalog();
    updateReleaseSummary(wizardState.catalog);
    setVersionOptions();
    updateContainerCommand();
    document.dispatchEvent(new Event("target-selection-ready"));
  } catch {
    getElement("rpm-command").textContent =
      "Release metadata is temporarily unavailable. Read the stable repository instructions for help.";
  }
}

export default function __moduleApi0() {
  return { initReleaseWizard };
}
