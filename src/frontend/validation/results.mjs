function canonicalDistributionId(id) {
  return { debian: "debian-bookworm", ubuntu: "ubuntu-noble" }[id] || id;
}

function metadataStatus(result) {
  return typeof result === "string" ? result : result?.status;
}

function validationStatusIcon(status, directory = false) {
  if (directory) {
    const icon = status === "passed" ? "✓" : status === "failed" ? "✕" : "—";
    return `<span class="validation-icon ${status || "skip"}">${icon}</span>`;
  }
  if (status === "passed") return '<span class="validation-icon pass">✓</span>';
  if (status === "failed") return '<span class="validation-icon fail">✕</span>';
  return '<span class="validation-icon skip">—</span>';
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
