import { distroImages } from "./targets.mjs";

function pullReference(image, imageReferenceMode) {
  const name = image?.repository || "ghcr.io/eliware/centos10-node26";
  if (imageReferenceMode === "tag") {
    if (image?.reference) return image.reference;
    return image?.tag && image.tag !== name ? `${name}:${image.tag}` : name;
  }
  if (!image?.digest) return image?.reference || name;
  return `${name}@${image.digest}`;
}

function resolveContainerImage(catalog, distro, channel, version, imageReferenceMode) {
  const selected = (catalog.preview?.items || []).find((item) => item.candidate === version);
  const release = channel === "preview" ? selected : catalog.stable?.latest || catalog.stable;
  const imageRecord = (catalog.images || []).find(
    (item) =>
      (item.image?.repository || "") === distroImages[distro] &&
      item.channel === channel &&
      (channel === "preview"
        ? item.candidate === version
        : item.version ===
          (version === "stable" ? release?.node_version || release?.version : version)),
  );
  const selectedImage =
    imageRecord?.image || (distro === "centos-stream" ? release?.image : undefined);
  const repository = distroImages[distro];
  const image = {
    ...selectedImage,
    repository,
    tag:
      channel === "stable" && version === "stable"
        ? undefined
        : selectedImage?.exact_tag ||
          selectedImage?.reference?.split(":").at(-1) ||
          `${release?.node_version || release?.version || version}`,
  };
  return {
    reference: pullReference(image, imageReferenceMode),
    digest: selectedImage?.digest || "Not published yet",
    repositoryUrl: repository ? `https://ghcr.io/${repository.replace("ghcr.io/", "")}` : null,
  };
}

export default function __moduleApi0() {
  return { resolveContainerImage };
}
