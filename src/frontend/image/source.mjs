import __moduleApi1 from "../format.mjs";
const { previewCommit, previewDate } = __moduleApi1();

function displaySource(record) {
  if (record.channel === "rolling" || record.channel === "preview")
    return `${previewDate(record)} · ${previewCommit(record)}`;
  return record.source?.ref || `Node.js ${record.version}`;
}

export default function __moduleApi0() {
  return { displaySource };
}
