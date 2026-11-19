import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "../format.mjs";
const { formatDateTime, previewCommit } = __moduleApifix1();
import __moduleApifix2 from "./search.mjs";
const { releaseFor } = __moduleApifix2();
import { state } from "./state.mjs";

function renderTimeline() {
  const timeline = getElement("release-timeline");
  if (!timeline) return;
  const stable = state.catalog.stable;
  const preview = state.catalog.preview;
  const events = [];
  if (stable?.version)
    events.push({
      label: `Stable ${stable.version}`,
      detail: stable.built || stable.generated,
      status: "Published",
    });
  (preview?.items || []).slice(0, 5).forEach((item) =>
    events.push({
      label: `Rolling ${item.candidate || previewCommit(item)}`,
      detail: item.built || item.generated,
      status: item.validation ? "Validated" : "Published",
    }),
  );
  if (state.manifest?.generated)
    events.push({
      label: "Repository manifest",
      detail: state.manifest.generated,
      status: "Signed metadata",
    });
  timeline.replaceChildren();
  if (!events.length) {
    timeline.textContent =
      "Release lifecycle data will appear after the first validated publication.";
    return;
  }
  events.forEach((event) => {
    const item = document.createElement("li");
    item.innerHTML = `<span class="timeline-dot" aria-hidden="true"></span><div><strong>${event.label}</strong><span>${event.status} · ${formatDateTime(event.detail)}</span></div>`;
    timeline.appendChild(item);
  });
}

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
  return { renderTimeline, releaseOptions, renderComparison, populateComparison };
}
