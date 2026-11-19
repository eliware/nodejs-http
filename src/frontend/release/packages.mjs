function allPackages(index) {
  return Object.values(index.directories || {}).flatMap((directory) =>
    (directory.entries || [])
      .filter((entry) => entry.type === "file" && entry.package)
      .map((entry) => ({ ...entry, directory: directory.path })),
  );
}

function releaseFor(entry) {
  const parts = entry.href.split("/").filter(Boolean);
  const previewIndex = parts.indexOf("previews");
  if (previewIndex >= 0)
    return { channel: "rolling", version: parts[previewIndex + 1] || "rolling" };
  const versionIndex = parts.findIndex((part) => /^\d+\.\d+$/.test(part));
  return { channel: "stable", version: versionIndex >= 0 ? parts[versionIndex] : "stable" };
}

export default function __moduleApi0() {
  return { allPackages, releaseFor };
}
