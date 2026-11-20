import guideReaderApi from "./guides/file-reader.mjs";
const { readGuideFile } = guideReaderApi();
import guideCacheApi from "./guides/cache.mjs";
const { readCachedGuide } = guideCacheApi();
import guideDocumentApi from "./guides/document.mjs";
const { parseGuideDocument } = guideDocumentApi();

async function readGuide(publicDir, action, os, channel, filesystem) {
  const result = await readGuideFile(publicDir, action, os, channel, filesystem);
  if (!result) return null;
  return readCachedGuide(result.publicRoot, result.filePath, result.content, () =>
    parseGuideDocument(result.content, action, os, channel),
  );
}

export default function __moduleApi0() {
  return { readGuide };
}
