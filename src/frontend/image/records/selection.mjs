function selectImageRecords(records, catalog, distro, channel, version) {
  const stableVersion =
    catalog.stable?.latest?.node_version || catalog.stable?.node_version || catalog.stable?.version;
  return records.filter(
    (record) =>
      record.distro === distro &&
      record.channel === channel &&
      (channel === "stable"
        ? record.version === (version === "stable" ? stableVersion : version)
        : record.candidate === version),
  );
}

export default function __moduleApi0() {
  return { selectImageRecords };
}
