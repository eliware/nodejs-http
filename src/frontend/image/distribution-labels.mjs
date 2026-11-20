const distroLabels = {
  "centos-stream": "CentOS Stream",
  rocky: "Rocky Linux",
  alma: "AlmaLinux",
  oracle: "Oracle Linux",
  debian: "Debian",
  ubuntu: "Ubuntu",
};
const distroReleases = {
  "centos-stream": "10",
  rocky: "10",
  alma: "10",
  oracle: "10",
  debian: "12",
  ubuntu: "24.04",
};

function distroLabel(distro) {
  return distroLabels[distro] || distro;
}

function distroRelease(distro) {
  return distroReleases[distro] || "unknown";
}

export default function __moduleApi0() {
  return { distroLabel, distroRelease };
}
