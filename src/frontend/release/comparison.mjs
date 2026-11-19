import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "./packages.mjs";
const { releaseFor } = __moduleApifix1();
import { state } from "./state.mjs";

function releaseOptions() {
  const options = [];
  if (state.catalog.stable?.version)
    options.push({
      id: `stable:${state.catalog.stable.version}`,
      label: `Stable ${state.catalog.stable.version}`,
      version: state.catalog.stable.version,
      channel: "stable",
    });
  (state.catalog.preview?.items || []).forEach((item) =>
    options.push({
      id: `rolling:${item.candidate}`,
      label: `Rolling ${item.candidate}`,
      version: item.candidate,
      channel: "rolling",
    }),
  );
  return options;
}

function packageCount(version, channel) {
  return state.packages.filter((entry) => {
    const release = releaseFor(entry);
    return release.version === version && release.channel === channel;
  }).length;
}

function renderComparison() {
  const result = getElement("release-comparison-result");
  const left = getElement("compare-from")?.value;
  const right = getElement("compare-to")?.value;
  if (!result || !left || !right) return;
  const options = releaseOptions();
  const from = options.find((item) => item.id === left);
  const to = options.find((item) => item.id === right);
  if (!from || !to) return;
  result.innerHTML = `<div><span>Packages</span><strong>${packageCount(from.version, from.channel)} → ${packageCount(to.version, to.channel)}</strong></div><div><span>Channel</span><strong>${from.channel} → ${to.channel}</strong></div><div><span>Release</span><strong>${from.label} → ${to.label}</strong></div>`;
}

function populateComparison() {
  const from = getElement("compare-from");
  const to = getElement("compare-to");
  if (!from || !to) return;
  const options = releaseOptions();
  [from, to].forEach((select, index) => {
    select.replaceChildren();
    options.forEach((option) => {
      const item = document.createElement("option");
      item.value = option.id;
      item.textContent = option.label;
      select.appendChild(item);
    });
    if (options[index]) select.value = options[index].id;
    select.addEventListener("change", renderComparison);
  });
  renderComparison();
}

export default function __moduleApi0() {
  return { releaseOptions, renderComparison, populateComparison };
}
