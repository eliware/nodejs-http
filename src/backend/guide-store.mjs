import guideReaderApi from "./guides/file-reader.mjs";
const { readGuideFile } = guideReaderApi();
import guideCacheApi from "./guides/cache.mjs";
const { readCachedGuide } = guideCacheApi();
import __moduleApifix1 from "./guides/schema.mjs";
const { validateGuide } = __moduleApifix1();
import __moduleApifixCoordinates from "./guides/coordinates.mjs";
const { validateGuideCoordinate } = __moduleApifixCoordinates();

async function readGuide(publicDir, action, os, channel, filesystem) {
  const result = await readGuideFile(publicDir, action, os, channel, filesystem);
  if (!result) return null;
  return readCachedGuide(result.publicRoot, result.filePath, result.content, () =>
    validateGuideCoordinate(validateGuide(JSON.parse(result.content)), action, os, channel),
  );
}

export default function __moduleApi0() {
  return { readGuide };
}
