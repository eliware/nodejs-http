import { expect, test } from "@jest/globals";
import { METADATA_SCHEMA_VERSION } from "../../../src/backend/metadata/schema-version.mjs";

test("uses the packaging repository metadata schema marker", () => {
  expect(METADATA_SCHEMA_VERSION).toBe("0.1.0");
});
