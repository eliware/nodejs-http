import __moduleApi1 from "../api.mjs";
const { fetchCatalog, fetchReleaseManifest, fetchRepositoryIndex } = __moduleApi1();
import __moduleApifix1 from "../dom.mjs";
const { getElement } = __moduleApifix1();
import { state } from "./state.mjs";
import __moduleApifix2 from "./search.mjs";
const { renderDetail, renderSearch } = __moduleApifix2();
import __moduleApifixPackages from "./packages.mjs";
const { allPackages } = __moduleApifixPackages();
import __moduleApifix3 from "./timeline.mjs";
const { renderTimeline } = __moduleApifix3();
import __moduleApifix4 from "./comparison.mjs";
const { populateComparison } = __moduleApifix4();

function initControls() {
  const search = getElement("package-search");
  search?.addEventListener("input", () => {
    state.query = search.value;
    renderSearch();
  });
  getElement("package-format")?.addEventListener("change", (event) => {
    state.format = event.target.value;
    renderSearch();
  });
  getElement("package-channel")?.addEventListener("change", (event) => {
    state.channel = event.target.value;
    renderSearch();
  });
  document.querySelectorAll("[data-package-detail-copy]").forEach((button) =>
    button.addEventListener("click", async () => {
      const target = getElement(button.dataset.packageDetailCopy);
      if (!target) return;
      await navigator.clipboard.writeText(target.textContent);
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2500);
    }),
  );
}

async function initReleaseExperience() {
  if (!getElement("package-search") && !getElement("package-detail-panel")) return;
  try {
    [state.catalog, state.index, state.manifest] = await Promise.all([
      fetchCatalog(),
      fetchRepositoryIndex(),
      fetchReleaseManifest().catch(() => null),
    ]);
    state.packages = allPackages(state.index);
    initControls();
    renderSearch();
    renderTimeline();
    populateComparison();
    const requested = new URLSearchParams(location.search).get("package");
    if (requested) renderDetail(state.packages.find((entry) => entry.href === requested));
  } catch {
    const status = getElement("package-search-status");
    if (status) status.textContent = "Package metadata is temporarily unavailable.";
  }
}

export default function __moduleApi0() {
  return { initReleaseExperience };
}
