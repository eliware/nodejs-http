import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();

const distributionLabels = {
  "centos-stream-10": "CentOS Stream 10",
  "rocky-10": "Rocky Linux 10",
  "almalinux-10": "AlmaLinux 10",
  "oracle-linux-10": "Oracle Linux 10",
  "debian-bookworm": "Debian 12 (bookworm)",
  "ubuntu-noble": "Ubuntu 24.04 (noble)",
};

function validationIcon(status) {
  const icon = status === "passed" ? "✓" : status === "failed" ? "✕" : "—";
  return `<span class="validation-icon ${status || "skip"}">${icon}</span>`;
}

function metadataStatus(result) {
  return typeof result === "string" ? result : result?.status;
}

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
  body.innerHTML = distributions
    .map((item) => {
      const rpmResult = rpm?.distributions?.find((candidate) => candidate.id === item.id);
      const containerResult = container?.distributions?.find(
        (candidate) => candidate.id === item.id,
      );
      const packageResult = rpmResult?.package_core || rpmResult?.core;
      const label = distributionLabels[item.id] || item.label || item.id;
      const repositoryResult =
        rpmResult?.repository_integrity ||
        rpmResult?.integrity ||
        containerResult?.repository_integrity;
      const provenanceResult =
        rpmResult?.provenance || rpmResult?.provenance_verification || containerResult?.provenance;
      return `<tr><th scope="row">${label}</th><td>${validationIcon(packageResult?.status)}</td>${hasContainer ? `<td>${validationIcon((containerResult?.container_core || containerResult?.core)?.status)}</td>` : ""}<td>${validationIcon(metadataStatus(repositoryResult))}</td><td>${validationIcon(metadataStatus(provenanceResult))}</td></tr>`;
    })
    .join("");
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
