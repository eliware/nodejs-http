import imageDistributionApi from "./distributions.mjs";
const { distroFromRepository, distroLabel, distroRelease } = imageDistributionApi();

function imageRecords(data) {
  return (data.images || [])
    .filter((record) => {
      const image = record.image || record;
      return (
        image.repository === "ghcr.io/eliware/centos10-node26" &&
        (!record.channel || record.channel === "stable")
      );
    })
    .map((record) => {
      const image = record.image || record;
      const repository = image.repository;
      const distro = distroFromRepository(repository);
      const version = record.version || record.node_version || "unknown";
      const tag = image.tag || version;
      return {
        ...record,
        image: {
          ...image,
          reference: image.reference || `${repository}:${tag}`,
        },
        distro,
        distroLabel: distroLabel(distro),
        repository,
        release: distroRelease(distro),
        arch: "x86_64",
        channel: "stable",
        version,
      };
    });
}

export default function __moduleApi0() {
  return { imageRecords };
}
