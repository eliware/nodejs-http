import { METADATA_SCHEMA_VERSION } from "../../../src/backend/metadata/schema-version.mjs";
import __moduleApi0 from "../../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApi0();

test("metadata support follows the packaging schema marker", () => {
  expect(SUPPORTED_METADATA_VERSION).toBe(METADATA_SCHEMA_VERSION);
  expect(METADATA_SCHEMA_VERSION).toBe("0.1.0");
});
