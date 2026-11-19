import __moduleApi1 from "./api.mjs";
const { fetchCatalog } = __moduleApi1();
import __moduleApifix1 from "./dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "./format.mjs";
const { formatDateTime } = __moduleApifix2();
import __moduleApifix3 from "./validation/results.mjs";
const { canonicalDistributionId, metadataStatus, resolveValidationResults, validationStatusIcon } =
  __moduleApifix3();

const supportedDistributions = [["centos-stream-10", "CentOS Stream 10"]];

async function initValidationMatrix() {
  const body = getElement("validation-rows");
  if (!body) return;
  try {
    const catalog = await fetchCatalog();
    const validation = catalog.stable?.validation;
    const containerValidations = [
      catalog.stable?.container_validation,
      ...(catalog.images || []).map((item) => item.container_validation),
    ].filter(Boolean);
    const containerValidation = containerValidations[0];
    body.innerHTML = supportedDistributions
      .map(([id, label]) => {
        const rpm = validation?.distributions?.find(
          (candidate) => canonicalDistributionId(candidate.id) === id,
        );
        const container = containerValidations
          .flatMap((candidate) => candidate.distributions || [])
          .find((candidate) => canonicalDistributionId(candidate.id) === id);
        const containerRecord = containerValidations.find((candidate) =>
          (candidate.distributions || []).some((item) => canonicalDistributionId(item.id) === id),
        );
        const results = resolveValidationResults({ rpm, container, validation, containerRecord });
        return `<tr><th scope="row">${label}</th><td>${validationStatusIcon(results.packageResult?.status)}</td><td>${validationStatusIcon(results.containerResult?.status)}</td><td>${validationStatusIcon(metadataStatus(results.repositoryResult))}</td><td>${validationStatusIcon(metadataStatus(results.provenanceResult))}</td></tr>`;
      })
      .join("");
    const checks = getElement("validation-checks");
    if (checks)
      checks.textContent = `Package, container, repository, and provenance checks · Results from ${formatDateTime(validation?.generated || containerValidation?.generated)}`;
  } catch {
    body.innerHTML =
      '<tr><td colspan="5">Validation metadata is temporarily unavailable.</td></tr>';
  }
}

export default function __moduleApi0() {
  return { initValidationMatrix };
}
