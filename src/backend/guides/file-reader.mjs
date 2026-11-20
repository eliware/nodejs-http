import path from "node:path";
import { constants } from "node:fs";
import { promises as fs } from "node:fs";
import guidePathApi from "./path.mjs";
const { guideFilePath } = guidePathApi();

function isOutsideRoot(root, file) {
  const relative = path.relative(path.resolve(root), path.resolve(file));
  return relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
}

async function readGuideFile(publicDir, action, os, channel, filesystem = fs) {
  const filePath = guideFilePath(publicDir, action, os, channel);
  if (!filePath) return null;
  const publicRoot = await filesystem.realpath(publicDir);
  const resolvedFile = await filesystem.realpath(filePath);
  if (isOutsideRoot(publicRoot, resolvedFile))
    throw new Error("guide path is outside the repository");
  const handle = await filesystem.open(resolvedFile, constants.O_RDONLY | constants.O_NOFOLLOW);
  let content;
  try {
    const [openedFile, currentFile] = await Promise.all([
      handle.stat(),
      filesystem.realpath(filePath),
    ]);
    if (isOutsideRoot(publicRoot, currentFile))
      throw new Error("guide path is outside the repository");
    const currentStats = await filesystem.stat(currentFile);
    if (openedFile.dev !== currentStats.dev || openedFile.ino !== currentStats.ino)
      throw new Error("guide file changed while it was being read");
    content = await handle.readFile("utf8");
  } finally {
    await handle.close();
  }
  return { content, filePath, publicRoot };
}

export default function __moduleApi0() {
  return { readGuideFile };
}
