import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/validation/results.mjs";
const { canonicalDistributionId, metadataStatus, resolveValidationResults, validationStatusIcon } =
  __moduleApi0();

test("normalizes distribution aliases and validation results", () => {
  expect(canonicalDistributionId("debian")).toBe("debian-bookworm");
  expect(canonicalDistributionId("custom")).toBe("custom");
  expect(metadataStatus("passed")).toBe("passed");
  expect(metadataStatus({ status: "failed" })).toBe("failed");
  const results = resolveValidationResults({
    rpm: { package_core: { status: "passed" }, integrity: "failed" },
    container: { core: { status: "failed" }, provenance: "passed" },
    validation: { repository_integrity: "passed" },
    containerRecord: { provenance: "failed" },
  });
  expect(results.packageResult.status).toBe("passed");
  expect(results.containerResult.status).toBe("failed");
  expect(results.repositoryResult).toBe("failed");
  expect(results.provenanceResult).toBe("passed");
  expect(validationStatusIcon("passed")).toContain("validation-icon pass");
  expect(validationStatusIcon("failed")).toContain("validation-icon fail");
  expect(validationStatusIcon("unknown")).toContain("validation-icon skip");
  expect(validationStatusIcon("passed", true)).toContain("validation-icon pass");
  expect(validationStatusIcon("failed", true)).toContain("validation-icon fail");
  expect(validationStatusIcon('<img src=x onerror="run()">', true)).toContain(
    "validation-icon skip",
  );
});
