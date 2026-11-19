import __moduleApi1 from "./dom.mjs";
const { getElement, queryAll } = __moduleApi1();

function initCopyControls() {
  queryAll("[data-copy]").forEach((button) =>
    button.addEventListener("click", async () => {
      const icon = button.querySelector(".copy-icon");
      const originalLabel = button.textContent;
      try {
        await navigator.clipboard.writeText(getElement(button.dataset.copy).innerText);
        if (icon) {
          button.classList.add("btn-success");
        } else button.textContent = "Copied";
        setTimeout(() => {
          if (icon) {
            button.classList.remove("btn-success");
          } else button.textContent = originalLabel;
        }, 3000);
      } catch {
        if (icon) {
          button.classList.add("copy-failed");
          setTimeout(() => button.classList.remove("copy-failed"), 3000);
        } else {
          button.textContent = "Retry";
          setTimeout(() => (button.textContent = originalLabel), 3000);
        }
      }
    }),
  );
}

export default function __moduleApi0() {
  return { initCopyControls };
}
