import path from "node:path";
import __moduleApi1 from "./metadata.mjs";
const { readJson } = __moduleApi1();

async function readDirectoryListingData(directoryPath, config, filesystem) {
  const entries = (await filesystem.readdir(directoryPath, { withFileTypes: true }))
    .filter((entry) => config.allowDotfiles || !entry.name.startsWith("."))
    .sort(
      (left, right) =>
        Number(right.isDirectory()) - Number(left.isDirectory()) ||
        left.name.localeCompare(right.name, undefined, { sensitivity: "base" }),
    );
  const details = await Promise.all(
    entries.map(async (entry) => {
      const isDirectory = entry.isDirectory();
      const isFile = entry.isFile();
      const isSymbolicLink = entry.isSymbolicLink?.() || false;
      if (!isDirectory && !isFile && !isSymbolicLink) return null;
      if (isSymbolicLink && !config.allowSymlinks) return null;
      try {
        let targetPath = path.join(directoryPath, entry.name);
        if (isSymbolicLink) {
          if (!config.publicDir || !filesystem.realpath) return null;
          const [publicRoot, resolvedTarget] = await Promise.all([
            filesystem.realpath(config.publicDir),
            filesystem.realpath(targetPath),
          ]);
          const relativeTarget = path.relative(path.resolve(publicRoot), resolvedTarget);
          if (
            relativeTarget === ".." ||
            relativeTarget.startsWith(`..${path.sep}`) ||
            path.isAbsolute(relativeTarget)
          )
            return null;
          targetPath = resolvedTarget;
        }
        const stats = await filesystem.stat(targetPath);
        if (isSymbolicLink && !stats.isDirectory() && !stats.isFile()) return null;
        return {
          name: entry.name,
          isDirectory: isSymbolicLink ? stats.isDirectory() : isDirectory,
          stats,
        };
      } catch {
        return { name: entry.name, isDirectory, stats: null };
      }
    }),
  ).then((items) => items.filter(Boolean));
  const [validation, containerValidation, template] = await Promise.all([
    readJson(directoryPath, "validation.json", filesystem),
    readJson(directoryPath, "container-validation.json", filesystem),
    filesystem.readFile(config.directoryTemplate, "utf8").catch(() => null),
  ]);
  return { entries: details, validation, containerValidation, template };
}

export default function __moduleApi0() {
  return { readDirectoryListingData };
}
