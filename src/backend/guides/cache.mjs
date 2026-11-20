import { createHash } from "node:crypto";

const cache = new Map();

function readCachedGuide(publicRoot, filePath, content, createValue) {
  const signature = createHash("sha256").update(content).digest("hex");
  const cacheKey = `${publicRoot}\0${filePath}`;
  const cached = cache.get(cacheKey);
  if (cached?.signature === signature) return cached.value;
  const value = createValue();
  cache.set(cacheKey, { signature, value });
  return value;
}

export default function __moduleApi0() {
  return { readCachedGuide };
}
