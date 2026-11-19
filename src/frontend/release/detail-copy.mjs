import __moduleApi1 from "../dom.mjs";
const { getElement } = __moduleApi1();

function initDetailCopy() {
  document.querySelectorAll("[data-package-detail-copy]").forEach((button) =>
    button.addEventListener("click", async () => {
      const target = getElement(button.dataset.packageDetailCopy);
      if (!target) return;
      await navigator.clipboard.writeText(target.textContent);
      button.classList.add("btn-success");
      setTimeout(() => {
        button.classList.remove("btn-success");
      }, 2500);
    }),
  );
}

export default function __moduleApi0() {
  return { initDetailCopy };
}
