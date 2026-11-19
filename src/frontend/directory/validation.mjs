import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "../validation/results.mjs";
const { metadataStatus, resolveValidationResults, validationStatusIcon } = __moduleApifix1();
import __moduleApifix2 from "../../shared/directory/distribution-labels.mjs";
const { distributionLabels } = __moduleApifix2();

function renderValidation(listing) {
  const section = getElement("directory-validation");
  const body = getElement("directory-validation-rows");
  if (!section || !body) return;
  const rpm = listing.validation;
  const container = listing.container_validation;
  const hasContainer = Boolean(container?.distributions?.length);
  const distributions = [...(rpm?.distributions || []), ...(container?.distributions || [])].filter(
    (item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index,
  );
  if (!distributions.length) return;
  body.replaceChildren();
  distributions.forEach((item) => {
    const rpmResult = rpm?.distributions?.find((candidate) => candidate.id === item.id);
    const containerResult = container?.distributions?.find((candidate) => candidate.id === item.id);
    const label = distributionLabels[item.id] || item.label || item.id;
    const results = resolveValidationResults({ rpm: rpmResult, container: containerResult });
    const row = document.createElement("tr");
    const heading = document.createElement("th");
    heading.setAttribute("scope", "row");
    heading.textContent = label;
    row.appendChild(heading);
    const statuses = [results.packageResult?.status];
    if (hasContainer) statuses.push(results.containerResult?.status);
    statuses.push(
      metadataStatus(results.repositoryResult),
      metadataStatus(results.provenanceResult),
    );
    statuses.forEach((status) => {
      const cell = document.createElement("td");
      cell.innerHTML = validationStatusIcon(status, true);
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
  section.hidden = false;
  const headers = section.querySelectorAll("thead th");
  if (headers[2]) headers[2].hidden = !hasContainer;
  body.querySelectorAll("tr").forEach((row) => {
    if (row.children[2]) row.children[2].hidden = !hasContainer;
  });
}

export default function __moduleApi0() {
  return { renderValidation };
}
