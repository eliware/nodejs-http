import __moduleApi1 from "../format.mjs";
const { previewCommit, previewDate } = __moduleApi1();

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

function imageRecords(data) {
  return (data.images || []).map((record) => {
    const repository = record.image?.repository || "";
    const distro =
      record.distribution ||
      record.distro ||
      record.image?.distribution ||
      distroFromRepository(repository);
    const channel = record.channel || (record.source?.ref === "devel" ? "rolling" : "stable");
    return {
      ...record,
      distro,
      distroLabel: distroLabels[distro] || distro,
      repository,
      release: distroReleases[distro] || "unknown",
      arch: "x86_64",
      channel,
      version:
        channel === "preview" || channel === "rolling"
          ? record.candidate || record.version || "unknown"
          : record.version || "unknown",
    };
  });
}

function displaySource(record) {
  if (record.channel === "rolling" || record.channel === "preview")
    return `${previewDate(record)} · ${previewCommit(record)}`;
  return record.source?.ref || `Node.js ${record.version}`;
}

export default function __moduleApi0() {
  return { distroFromRepository, imageRecords, displaySource };
}
