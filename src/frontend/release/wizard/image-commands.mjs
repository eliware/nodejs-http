import __moduleApi1 from "../../dom.mjs";
const { getElement } = __moduleApi1();
import { wizardState } from "./state.mjs";
import __moduleApifix1 from "./images.mjs";
const { resolveContainerImage } = __moduleApifix1();

function setImageReferenceMode(value) {
  wizardState.imageReferenceMode = value;
  document.querySelectorAll("[data-image-reference]").forEach((button) => {
    const selected = button.dataset.imageReference === value;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateContainerCommand();
}

function updateContainerCommand() {
  const channel = getElement("target-channel").value;
  const version = getElement("target-version").value;
  const image = resolveContainerImage(
    wizardState.catalog,
    "centos-stream",
    channel,
    version,
    wizardState.imageReferenceMode,
  );
  const reference = getElement("image-ref");
  const digest = getElement("image-digest");
  if (reference) reference.textContent = image.reference;
  if (digest) digest.textContent = image.digest;
  const repositoryLink = getElement("image-repository-link");
  if (repositoryLink && image.repositoryUrl) repositoryLink.href = image.repositoryUrl;
}

export default function __moduleApi0() {
  return { setImageReferenceMode, updateContainerCommand };
}
