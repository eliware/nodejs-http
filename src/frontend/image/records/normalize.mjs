import imageRecordDistributionApi from "./distribution.mjs";
const { mapImageDistribution } = imageRecordDistributionApi();

function normalizeImageRecord(record) {
  const image = record.image || record;
  const repository = image.repository;
  const version = record.version || record.node_version || "unknown";
  const tag = image.tag || version;
  return {
    ...record,
    image: {
      ...image,
      reference: image.reference || `${repository}:${tag}`,
    },
    repository,
    ...mapImageDistribution(repository),
    arch: "x86_64",
    channel: "stable",
    version,
  };
}

export default function __moduleApi0() {
  return { normalizeImageRecord };
}
