import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();
import __moduleApifix1 from "../format.mjs";
const { formatDateTime } = __moduleApifix1();
import { state } from "./state.mjs";

function renderTimeline() {
  const timeline = getElement("release-timeline");
  if (!timeline) return;
  const stable = state.catalog.stable;
  const events = [];
  const releases = stable?.items || (stable?.latest ? [stable.latest] : stable ? [stable] : []);
  releases.slice(0, 10).forEach((item) =>
    events.push({
      label: `Node.js ${item.node_version || item.version || "stable"}`,
      detail: item.built || item.generated,
      status: item.validation?.status === "passed" ? "Validated" : "Published",
    }),
  );
  timeline.replaceChildren();
  if (!events.length) {
    timeline.textContent =
      "Release lifecycle data will appear after the first validated publication.";
    return;
  }
  events.forEach((event) => {
    const item = document.createElement("li");
    const dot = document.createElement("span");
    dot.className = "timeline-dot";
    dot.setAttribute("aria-hidden", "true");
    const content = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = event.label;
    const detail = document.createElement("span");
    detail.textContent = `${event.status} · ${formatDateTime(event.detail)}`;
    content.append(label, detail);
    item.append(dot, content);
    timeline.appendChild(item);
  });
}

export default function __moduleApi0() {
  return { renderTimeline };
}
