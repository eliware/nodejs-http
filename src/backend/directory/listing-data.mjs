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
      try {
        return {
          name: entry.name,
          isDirectory: entry.isDirectory(),
          stats: await filesystem.stat(path.join(directoryPath, entry.name)),
        };
      } catch {
        return { name: entry.name, isDirectory: entry.isDirectory(), stats: null };
      }
    }),
  );
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
