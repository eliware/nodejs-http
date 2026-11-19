import __moduleApi1 from "./api.mjs";
const { fetchCatalog, fetchReleaseManifest } = __moduleApi1();
import __moduleApifix1 from "./dom.mjs";
const { getElement } = __moduleApifix1();
import __moduleApifix2 from "./format.mjs";
const { formatDateTime } = __moduleApifix2();
import __moduleApifix3 from "./validation/results.mjs";
const { metadataStatus, validationStatusIcon } = __moduleApifix3();

const supportedDistributions = [["centos-stream-10", "CentOS Stream 10"]];

async function initValidationMatrix() {
  const body = getElement("validation-rows");
  if (!body) return;
  try {
    const catalog = await fetchCatalog();
    const image = catalog.images?.[0];
    const manifest = await fetchReleaseManifest();
    const packageValidation = catalog.stable.latest.validation;
    const imageValidation = image.validation;
    const activeGeneration = catalog.active_generation;
    const repositoryStatus =
      manifest.generation_id === activeGeneration && manifest.signed && manifest.publication_ready
        ? "passed"
        : "failed";
    const manifestPaths = new Set((manifest.files || []).map(({ path }) => path));
    const provenanceStatus = [catalog.stable.latest.provenance_path, image.provenance_path].every(
      (path) => path && manifestPaths.has(path) && manifestPaths.has(`${path}.asc`),
    )
      ? "passed"
      : "failed";
    body.innerHTML = supportedDistributions
      .map(([, label]) => {
        return `<tr><th scope="row">${label}</th><td>${validationStatusIcon(metadataStatus(packageValidation))}</td><td>${validationStatusIcon(metadataStatus(imageValidation))}</td><td>${validationStatusIcon(repositoryStatus)}</td><td>${validationStatusIcon(provenanceStatus)}</td></tr>`;
      })
      .join("");
    const checks = getElement("validation-checks");
    if (checks)
      checks.textContent = `Package, container, repository, and provenance checks · Results from ${formatDateTime(image.generated || catalog.generated)}`;
  } catch {
    body.innerHTML =
      '<tr><td colspan="5">Validation metadata is temporarily unavailable.</td></tr>';
  }
}

export default function __moduleApi0() {
  return { initValidationMatrix };
}
