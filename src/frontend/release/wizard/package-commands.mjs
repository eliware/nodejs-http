import __moduleApiApi from "../../api.mjs";
const { origin } = __moduleApiApi();
import __moduleApifix1 from "../../dom.mjs";
const { getElement } = __moduleApifix1();
import { wizardState } from "./state.mjs";
import { distroRepositories, distroTargets } from "./targets.mjs";
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
  const channel = getElement("target-channel").value;
  const version = getElement("target-version").value;
  const preview = channel === "preview";
  const release = wizardState.catalog.stable?.latest || wizardState.catalog.stable;
  const selected = (wizardState.catalog.preview?.items || []).find(
    (item) => item.candidate === version,
  );
  const repository = distroRepositories["centos-stream"];
  const prerequisite = `sudo ${wizardState.packageManager} install -y ${repository.packages.join(" ")}`;
  const title = getElement("package-install-title");
  const managerTools = getElement("package-manager-tools");
  const repoFile = getElement("package-repo-file");
  const repoSeparator = getElement("package-repo-separator");
  const browse = getElement("rpm-browse");
  if (title) title.textContent = "Install with DNF";
  if (managerTools) managerTools.hidden = false;
  if (repoFile) {
    repoFile.hidden = false;
    repoFile.href = distroTargets["centos-stream"].repoFile;
  }
  if (repoSeparator) repoSeparator.hidden = false;
  if (browse) browse.href = `${origin}/el10/x86_64/${preview ? `previews/${version}` : "stable"}/`;
  const lines = [prerequisite];
  if (preview && selected?.rpm_repo) {
    lines.push(
      `sudo ${wizardState.packageManager} --repofrompath=nodejs26-preview,${selected.rpm_repo} --setopt=nodejs26-preview.gpgcheck=1 --setopt=nodejs26-preview.repo_gpgcheck=1 --setopt=nodejs26-preview.gpgkey=${origin}/keys/RPM-GPG-KEY-ELIWARE-NODEJS --enablerepo=nodejs26-preview install -y eliware-nodejs26`,
    );
  } else {
    lines.push(
      `sudo ${wizardState.packageManager} config-manager --add-repo ${origin}${distroTargets["centos-stream"].repoFile}`,
      `sudo ${wizardState.packageManager} install -y eliware-nodejs26`,
      `sudo ${wizardState.packageManager} -y update`,
    );
  }
  const command = getElement("rpm-command");
  if (command) command.textContent = lines.join("\n");
  const status = getElement("rpm-status");
  if (status)
    status.textContent = preview
      ? "Install the selected Node.js 26 preview on CentOS Stream 10."
      : `Install Node.js ${release?.node_version || release?.version || "26"} on CentOS Stream 10.`;
}

export default function __moduleApi0() {
  return { setPackageManager, updateCommand };
}
