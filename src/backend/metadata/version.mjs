import { METADATA_SCHEMA_VERSION } from "./schema-version.mjs";

const SUPPORTED_METADATA_VERSION = METADATA_SCHEMA_VERSION;

function assertMetadataVersion(value, label) {
  if (value?.metadata_version !== SUPPORTED_METADATA_VERSION)
    throw new Error(
      `${label} metadata version ${value?.metadata_version || "missing"} is unsupported`,
    );
  return value;
}

export default function __moduleApi0() {
  return { SUPPORTED_METADATA_VERSION, assertMetadataVersion };
}
