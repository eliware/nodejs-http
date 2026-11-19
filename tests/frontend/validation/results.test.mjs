import { expect, test } from "@jest/globals";
import validationResults from "../../../src/frontend/validation/results.mjs";

const { canonicalDistributionId, metadataStatus, resolveValidationResults, validationStatusIcon } =
  validationResults();

test("normalizes metadata and status icons", () => {
  expect(canonicalDistributionId("debian")).toBe("debian-bookworm");
  expect(canonicalDistributionId("centos-stream-10")).toBe("centos-stream-10");
  expect(metadataStatus("passed")).toBe("passed");
  expect(metadataStatus({ status: "failed" })).toBe("failed");
  expect(validationStatusIcon("passed")).toContain("validation-icon pass");
  expect(validationStatusIcon("failed")).toContain("validation-icon fail");
  expect(validationStatusIcon("unknown")).toContain("validation-icon skip");
  expect(validationStatusIcon("passed", true)).toContain("validation-icon pass");
  expect(validationStatusIcon("failed", true)).toContain("validation-icon fail");
  expect(validationStatusIcon("unknown", true)).toContain("validation-icon skip");
});

test("resolves package and container checks with their metadata fallbacks", () => {
  expect(
    resolveValidationResults({
      rpm: { core: "package", integrity: "rpm integrity", provenance_verification: "rpm proof" },
      container: {
        core: "image",
        repository_integrity: "image integrity",
        provenance: "image proof",
      },
      validation: {},
      containerRecord: {},
    }),
  ).toEqual({
    packageResult: "package",
    containerResult: "image",
    repositoryResult: "rpm integrity",
    provenanceResult: "rpm proof",
  });
  expect(
    resolveValidationResults({
      container: {
        container_core: "image",
        repository_integrity: "image integrity",
        provenance: "image proof",
      },
      containerRecord: {
        repository_integrity: "record integrity",
        provenance_verification: "record proof",
      },
    }),
  ).toEqual({
    packageResult: undefined,
    containerResult: "image",
    repositoryResult: "image integrity",
    provenanceResult: "image proof",
  });
  expect(
    resolveValidationResults({
      containerRecord: { repository_integrity: "record integrity", provenance: "record proof" },
    }),
  ).toEqual({
    packageResult: undefined,
    containerResult: undefined,
    repositoryResult: "record integrity",
    provenanceResult: "record proof",
  });
});
