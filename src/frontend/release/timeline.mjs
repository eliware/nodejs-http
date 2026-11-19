import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "../format.mjs";
const { formatDateTime, previewCommit } = __moduleApifix1();
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

export default function __moduleApi0() {
  return { renderTimeline };
}
