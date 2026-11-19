export const distroImages = {
  "centos-stream": "ghcr.io/eliware/centos10-node26",
};

export const distroTargets = {
  "centos-stream": {
    label: "CentOS Stream",
    release: "10",
    family: "rpm",
    repository: "/el10/x86_64",
    repoFile: "/nodejs26.repo",
  },
};

export const distroRepositories = {
  "centos-stream": {
    packages: ["dnf-plugins-core", "epel-release"],
  },
};
