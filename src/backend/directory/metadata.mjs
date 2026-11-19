import path from "node:path";

async function readJson(directoryPath, name, filesystem) {
  try {
    return JSON.parse(await filesystem.readFile(path.join(directoryPath, name), "utf8"));
  } catch {
    return null;
  }
}

export default function __moduleApi0() {
  return { readJson };
}
