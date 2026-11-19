function validationIcon(status) {
  if (status === "passed") return '<span class="validation-pass">✓</span>';
  if (status === "failed") return '<span class="validation-fail">✕</span>';
  return '<span class="validation-skip">—</span>';
}

function metadataStatus(result) {
  return typeof result === "string" ? result : result?.status;
}

export default function __moduleApi0() {
  return { validationIcon, metadataStatus };
}
