import { distroImages } from "./targets.mjs";

function pullReference(image, imageReferenceMode) {
  const name = image.repository;
  if (imageReferenceMode === "tag") {
    return image.reference;
  }
  if (!image.digest) return image.reference;
  return `${name}@${image.digest}`;
}

function resolveContainerImage(catalog, distro, channel, version, imageReferenceMode) {
  const release = catalog.stable?.latest || catalog.stable;
  const imageRecord = (catalog.images || []).find((item) => {
    const image = item.image || item;
    return (
      image.repository &&
      image.repository === distroImages[distro] &&
      (item.channel || "stable") === channel &&
      (item.version || item.node_version || item.candidate) ===
        (version === "stable" ? release?.node_version || release?.version : version)
    );
  });
  const selectedImage =
    imageRecord?.image || imageRecord || (distro === "centos-stream" ? release?.image : undefined);
  const repositoryUrlTarget = distroImages[distro];
  const repository =
    selectedImage?.repository || repositoryUrlTarget || "ghcr.io/eliware/centos10-node26";
  const tag =
    selectedImage?.tag ||
    selectedImage?.exact_tag ||
    selectedImage?.reference?.split(":").at(-1) ||
    imageRecord?.candidate ||
    (channel !== "stable" ? version : undefined) ||
    release?.node_version ||
    release?.version;
  const image = {
    ...selectedImage,
    repository,
    tag,
    reference: selectedImage?.reference || (tag ? `${repository}:${tag}` : repository),
  };
  return {
    reference: pullReference(image, imageReferenceMode),
    digest: selectedImage?.digest || "Not published yet",
    repositoryUrl: repositoryUrlTarget
      ? `https://ghcr.io/${repositoryUrlTarget.replace("ghcr.io/", "")}`
      : null,
  };
}

export default function __moduleApi0() {
  return { resolveContainerImage };
}
