import __moduleApi1 from "../format.mjs";
const { previewCommit, previewDate } = __moduleApi1();
import imageDistributionApi from "./distributions.mjs";
const { distroFromRepository, distroLabel, distroRelease } = imageDistributionApi();

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
      distroLabel: distroLabel(distro),
      repository,
      release: distroRelease(distro),
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
  return { imageRecords, displaySource };
}
