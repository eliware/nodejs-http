function displaySource(record) {
  return record.source?.ref || `Node.js ${record.version}`;
}

export default function __moduleApi0() {
  return { displaySource };
}
