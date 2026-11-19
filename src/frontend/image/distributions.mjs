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
const repositoryDistributions = {
  "centos10-node26": "centos-stream",
  "rocky10-gluster": "rocky",
  "alma10-gluster": "alma",
  "oracle10-gluster": "oracle",
  "debian12-gluster": "debian",
  "ubuntu2404-gluster": "ubuntu",
};

function distroFromRepository(repository) {
  const name = repository.split("/").at(-1) || "";
  return repositoryDistributions[name] || "centos-stream";
}

function distroLabel(distro) {
  return distroLabels[distro] || distro;
}

function distroRelease(distro) {
  return distroReleases[distro] || "unknown";
}

export default function __moduleApi0() {
  return { distroFromRepository, distroLabel, distroRelease };
}
