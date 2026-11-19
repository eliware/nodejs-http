function canonicalDistributionId(id) {
  return { debian: "debian-bookworm", ubuntu: "ubuntu-noble" }[id] || id;
}

function metadataStatus(result) {
  return typeof result === "string" ? result : result?.status;
}

function validationStatusIcon(status, directory = false) {
  const passed = status === "passed";
  const failed = status === "failed";
  const className = passed ? "pass" : failed ? "fail" : "skip";
  const label = passed ? "Passed" : failed ? "Failed" : directory ? "Not checked" : "Not available";
  if (passed)
    return `<span class="validation-icon ${className}" role="img" aria-label="${label}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5" /></svg></span>`;
  if (failed)
    return `<span class="validation-icon ${className}" role="img" aria-label="${label}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" /></svg></span>`;
  return `<span class="validation-icon ${className}" role="img" aria-label="${label}">—</span>`;
}

function resolveValidationResults({ rpm, container, validation, containerRecord }) {
  return {
    packageResult: rpm?.package_core || rpm?.core,
    containerResult: container?.container_core || container?.core,
    repositoryResult:
      rpm?.repository_integrity ||
      rpm?.integrity ||
      container?.repository_integrity ||
      (rpm ? validation?.repository_integrity : null) ||
      containerRecord?.repository_integrity,
    provenanceResult:
      rpm?.provenance ||
      rpm?.provenance_verification ||
      container?.provenance ||
      (rpm ? validation?.provenance_verification : null) ||
      containerRecord?.provenance_verification ||
      containerRecord?.provenance,
  };
}

export default function __moduleApi0() {
  return {
    canonicalDistributionId,
    metadataStatus,
    resolveValidationResults,
    validationStatusIcon,
  };
}
