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

export default function __moduleApi0() {
  return { distroFromRepository };
}
