import path from "node:path";
import { promises as fs } from "node:fs";
import { constants } from "node:fs";
import { createHash } from "node:crypto";
import guidePathApi from "./guides/path.mjs";
const { GUIDE_ACTIONS, GUIDE_OSES, GUIDE_CHANNELS, guideFilePath } = guidePathApi();
import __moduleApifix1 from "./guides/schema.mjs";
const { validateGuide } = __moduleApifix1();
import __moduleApifixCoordinates from "./guides/coordinates.mjs";
const { validateGuideCoordinate } = __moduleApifixCoordinates();
const cache = new Map();

function isOutsideRoot(root, file) {
  const relative = path.relative(path.resolve(root), path.resolve(file));
  return relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
}

async function readGuide(publicDir, action, os, channel, filesystem = fs) {
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
  const signature = createHash("sha256").update(content).digest("hex");
  const cacheKey = `${publicRoot}\0${filePath}`;
  const cached = cache.get(cacheKey);
  if (cached?.signature === signature) return cached.value;
  const value = validateGuideCoordinate(validateGuide(JSON.parse(content)), action, os, channel);
  cache.set(cacheKey, { signature, value });
  return value;
}

export default function __moduleApi0() {
  return { GUIDE_ACTIONS, GUIDE_OSES, GUIDE_CHANNELS, guideFilePath, readGuide };
}
