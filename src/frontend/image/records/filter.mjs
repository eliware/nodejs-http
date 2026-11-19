function filterImageRecords(data) {
  return (data.images || []).filter((record) => {
    const image = record.image || record;
    return (
      image.repository === "ghcr.io/eliware/centos10-node26" &&
      (!record.channel || record.channel === "stable")
    );
  });
}

export default function __moduleApi0() {
  return { filterImageRecords };
}
