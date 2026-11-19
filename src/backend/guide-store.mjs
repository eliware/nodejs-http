import path from "node:path";
import { readFile, realpath } from "node:fs/promises";
import { createHash } from "node:crypto";
import guidePathApi from "./guides/path.mjs";
const { GUIDE_ACTIONS, GUIDE_OSES, GUIDE_CHANNELS, guideFilePath } = guidePathApi();
import __moduleApifix1 from "./guides/schema.mjs";
const { validateGuide } = __moduleApifix1();
const cache = new Map();

async function readGuide(publicDir, action, os, channel) {
  const filePath = guideFilePath(publicDir, action, os, channel);
  if (!filePath) return null;
  const [publicRoot, resolvedFile] = await Promise.all([realpath(publicDir), realpath(filePath)]);
  const relativeFile = path.relative(publicRoot, resolvedFile);
  if (
    relativeFile === ".." ||
    relativeFile.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeFile)
  )
    throw new Error("guide path is outside the repository");
  const content = await readFile(resolvedFile, "utf8");
  const signature = createHash("sha256").update(content).digest("hex");
  const cached = cache.get(filePath);
  if (cached?.signature === signature) return cached.value;
  const value = validateGuide(JSON.parse(content), os, channel);
  cache.set(filePath, { signature, value });
  return value;
}

export default function __moduleApi0() {
  return { GUIDE_ACTIONS, GUIDE_OSES, GUIDE_CHANNELS, guideFilePath, readGuide };
}
