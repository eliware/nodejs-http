import __moduleApi1 from "./html-escaping.mjs";
const { escapeHtml } = __moduleApi1();
import __moduleApifix1 from "./validation/status.mjs";
const { validationIcon, metadataStatus } = __moduleApifix1();
import __moduleApifix2 from "../../shared/directory/distribution-labels.mjs";
const { distributionLabels } = __moduleApifix2();

function renderValidation(validation, containerValidation) {
  const distributions = [
    ...(validation?.distributions || []),
    ...(containerValidation?.distributions || []),
  ].filter(
    (item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index,
  );
  if (!distributions.length) return "";
  const hasContainer = Boolean(containerValidation?.distributions?.length);
  const rows = distributions
    .map((item) => {
      const rpm = validation?.distributions?.find((candidate) => candidate.id === item.id);
      const container = containerValidation?.distributions?.find(
        (candidate) => candidate.id === item.id,
      );
      const packageResult = rpm?.package_core || rpm?.core;
      const label = distributionLabels[item.id] || item.label || item.id;
      const repositoryResult =
        rpm?.repository_integrity || rpm?.integrity || container?.repository_integrity;
      const provenanceResult =
        rpm?.provenance || rpm?.provenance_verification || container?.provenance;
      return `<tr><th scope="row">${escapeHtml(label)}</th><td>${validationIcon(packageResult?.status)}</td>${hasContainer ? `<td>${validationIcon((container?.container_core || container?.core)?.status)}</td>` : ""}<td>${validationIcon(metadataStatus(repositoryResult))}</td><td>${validationIcon(metadataStatus(provenanceResult))}</td></tr>`;
    })
    .join("");
  return `<section class="validation-summary" aria-labelledby="validation-title"><div><p class="eyebrow">Build verification</p><h2 id="validation-title">Compatibility checks</h2><p>Package${hasContainer ? ", container" : ""}, repository integrity, and provenance validation for this package set.</p></div><table><thead><tr><th>Distribution</th><th>Package core</th>${hasContainer ? "<th>Container core</th>" : ""}<th>Repository integrity</th><th>Provenance</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

export default function __moduleApi0() {
  return { distributionLabels, validationIcon, metadataStatus, renderValidation };
}
