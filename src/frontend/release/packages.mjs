function allPackages(index) {
  return Object.values(index.directories || {}).flatMap((directory) =>
    (directory.entries || [])
      .filter((entry) => entry.type === "file" && entry.name?.endsWith(".rpm"))
      .map((entry) => ({ ...entry, package: { format: "rpm" }, directory: directory.path })),
  );
}

function releaseFor(entry) {
  const filenameVersion = entry.name.match(/^eliware-node26-(\d+\.\d+\.\d+)-/)?.[1];
  return { channel: "stable", version: filenameVersion || "stable" };
}

export default function __moduleApi0() {
  return { allPackages, releaseFor };
}
