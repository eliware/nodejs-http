import path from "node:path";
import { promises as fs } from "node:fs";

async function listFilesystemDirectories(config, filesystem = fs) {
  const directories = [];
  async function visit(directory, requestPath) {
    directories.push(requestPath);
    for (const entry of await filesystem.readdir(directory, { withFileTypes: true })) {
      if (!entry.isDirectory() || (!config.allowDotfiles && entry.name.startsWith("."))) continue;
      await visit(
        path.join(directory, entry.name),
        `${requestPath}${encodeURIComponent(entry.name)}/`,
      );
    }
  }
  await visit(config.publicDir, "/");
  return directories.sort();
}

export default function __moduleApi0() {
  return { listFilesystemDirectories };
}
