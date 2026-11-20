import __moduleApifix1 from "../../dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "../../format.mjs";
const { formatDateTime } = __moduleApifix2();
import { wizardState } from "./state.mjs";

function populateVersionOptions() {
  const version = getElement("target-version");
  if (!version) return;
  const stable = wizardState.catalog.stable?.latest || wizardState.catalog.stable;
  version.replaceChildren();
  const option = document.createElement("option");
  option.value = "stable";
  option.textContent =
    stable?.node_version || stable?.version
      ? `Latest stable (${stable.node_version || stable.version})`
      : "No stable release available";
  version.appendChild(option);
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

export default function __moduleApi0() {
  return { populateVersionOptions, updateReleaseSummary };
}
