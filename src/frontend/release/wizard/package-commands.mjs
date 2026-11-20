import __moduleApiApi from "../../api.mjs";
const { origin } = __moduleApiApi();
import __moduleApifix1 from "../../dom.mjs";
const { getElement } = __moduleApifix1();
import { wizardState } from "./state.mjs";
import { distroTargets } from "./targets.mjs";
import installCommandsApi from "./install-commands.mjs";
const { buildInstallCommands } = installCommandsApi();
function setPackageManager(value) {
  wizardState.packageManager = value;
  document.querySelectorAll("[data-package-manager]").forEach((button) => {
    const selected = button.dataset.packageManager === value;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateCommand();
}

function updateCommand() {
  const release = wizardState.catalog.stable?.latest || wizardState.catalog.stable;
  const upgrading = globalThis.location?.pathname?.startsWith("/upgrade") || false;
  const title = getElement("package-install-title");
  const managerTools = getElement("package-manager-tools");
  const repoFile = getElement("package-repo-file");
  const repoSeparator = getElement("package-repo-separator");
  const browse = getElement("rpm-browse");
  if (title)
    title.textContent = `${upgrading ? "Update" : "Install"} with ${wizardState.packageManager.toUpperCase()}`;
  if (managerTools) managerTools.hidden = false;
  if (repoFile) {
    repoFile.hidden = false;
    repoFile.href = distroTargets["centos-stream"].repoFile;
  }
  if (repoSeparator) repoSeparator.hidden = false;
  if (browse) browse.href = `${origin}/el10/x86_64/stable/`;
  const commandText = buildInstallCommands({
    packageManager: wizardState.packageManager,
    upgrading,
    origin,
    repositoryFile: distroTargets["centos-stream"].repoFile,
  });
  const command = getElement("rpm-command");
  if (command) command.textContent = commandText;
  const status = getElement("rpm-status");
  if (status)
    status.textContent = `${upgrading ? "Update" : "Install"} Node.js ${release?.node_version || release?.version || "26"} on CentOS Stream 10.`;
}

export default function __moduleApi0() {
  return { setPackageManager, updateCommand };
}
