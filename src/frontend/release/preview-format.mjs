import formatApi from "../format.mjs";
const { formatDateTime } = formatApi();

function previewDate(item) {
  return item?.built ? formatDateTime(item.built) : "Preview";
}

function previewCommit(item) {
  const commit = item?.source?.commit || item?.candidate?.match(/-([0-9a-f]{7,40})$/)?.[1];
  return commit ? commit.slice(0, 12) : "unknown commit";
}

export default function __moduleApi0() {
  return { previewDate, previewCommit };
}
