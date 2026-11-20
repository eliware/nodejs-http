import imageRecordDistributionApi from "./records/distribution.mjs";
const { mapImageDistribution } = imageRecordDistributionApi();
import imageRecordFilterApi from "./records/filter.mjs";
const { filterImageRecords } = imageRecordFilterApi();

function imageRecords(data) {
  return filterImageRecords(data).map((record) => {
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
  });
}

export default function __moduleApi0() {
  return { imageRecords };
}
