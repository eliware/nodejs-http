function renderComparisonView(from, to, fromPackageCount, toPackageCount) {
  return `<div><span>Packages</span><strong>${fromPackageCount} → ${toPackageCount}</strong></div><div><span>Channel</span><strong>${from.channel} → ${to.channel}</strong></div><div><span>Release</span><strong>${from.label} → ${to.label}</strong></div>`;
}

export default function __moduleApi0() {
  return { renderComparisonView };
}
