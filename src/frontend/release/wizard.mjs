import __moduleApi1 from "../api.mjs";
const { fetchCatalog } = __moduleApi1();
import __moduleApifix1 from "../dom.mjs";
const { getElement } = __moduleApifix1();
import { distroTargets } from "./wizard/targets.mjs";
import { wizardState } from "./wizard/state.mjs";
import __commands from "./wizard/commands.mjs";
const { setImageReferenceMode, setPackageManager, updateCommand, updateContainerCommand } =
  __commands();
import releaseSummaryApi from "./wizard/release-summary.mjs";
const { populateVersionOptions, updateReleaseSummary } = releaseSummaryApi();

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
  getElement("target-channel").addEventListener("change", () => {
    populateVersionOptions();
    updateCommand();
    updateContainerCommand();
  });
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
    populateVersionOptions();
    updateCommand();
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
