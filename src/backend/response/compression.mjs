import { brotliCompress, gzip } from "node:zlib";
import { promisify } from "node:util";

const brotliCompressAsync = promisify(brotliCompress);
const gzipAsync = promisify(gzip);

const QUALITY_VALUE = /^(?:0(?:\.\d{1,3})?|1(?:\.0{1,3})?)$/;

function acceptedEncodings(request) {
  const values = String(request?.headers?.["accept-encoding"] || "").toLowerCase();
  const accepted = new Map();
  for (const value of values.split(",")) {
    const [name, ...parameters] = value.trim().split(";");
    if (!name) continue;
    const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
    const qualityText = qualityParameter?.trim().slice(2);
    const quality =
      qualityText === undefined ? 1 : QUALITY_VALUE.test(qualityText) ? Number(qualityText) : 0;
    accepted.set(name.trim(), quality);
  }
  return accepted;
}

function qualityFor(accepted, encoding) {
  if (accepted.has(encoding)) return accepted.get(encoding);
  return accepted.get("*") || 0;
}

function chooseEncoding(request, contentType, length, config) {
  if (
    !config.compression ||
    length < config.compressionMinBytes ||
    !/^(text\/|application\/(json|javascript|xml)|image\/svg\+xml)/i.test(contentType)
  )
    return null;
  const accepted = acceptedEncodings(request);
  const brotliQuality = qualityFor(accepted, "br");
  const gzipQuality = qualityFor(accepted, "gzip");
  if (brotliQuality <= 0 && gzipQuality <= 0) return null;
  return brotliQuality >= gzipQuality ? "br" : "gzip";
}

async function compressBody(body, request, contentType, config) {
  const encoding = chooseEncoding(request, contentType, body.length, config);
  if (!encoding) return { body, headers: {} };
  return {
    body: encoding === "br" ? await brotliCompressAsync(body) : await gzipAsync(body),
    headers: { "Content-Encoding": encoding, Vary: "Accept-Encoding" },
  };
}

export default function __moduleApi0() {
  return { chooseEncoding, compressBody };
}
