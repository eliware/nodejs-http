import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../src/frontend/copy-controls.mjs";
const { initCopyControls } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

function setup(clipboardWrite, withIcon = false) {
  const button = new BrowserElement("button");
  button.dataset.copy = "source";
  button.textContent = "Copy";
  const source = new BrowserElement("pre");
  source.innerText = "command";
  if (withIcon) {
    const icon = new BrowserElement("span");
    icon.className = "copy-icon";
    icon.textContent = "⧉";
    button.appendChild(icon);
  }
  const state = installBrowserDom({ ids: ["source"], groups: { "[data-copy]": [button] } });
  state.elements.set("source", source);
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { clipboard: { writeText: clipboardWrite } },
  });
  return { button, source };
}

test("copies text and restores the plain button label", async () => {
  jest.useFakeTimers();
  const writeText = jest.fn(async () => {});
  const { button } = setup(writeText);
  initCopyControls();
  await Promise.all(button.dispatch("click"));
  expect(writeText).toHaveBeenCalledWith("command");
  expect(button.textContent).toBe("Copied");
  jest.runOnlyPendingTimers();
  expect(button.textContent).toBe("Copy");
  jest.useRealTimers();
});

test("updates and restores the icon after a successful copy", async () => {
  jest.useFakeTimers();
  const { button } = setup(
    jest.fn(async () => {}),
    true,
  );
  const icon = button.children[0];
  initCopyControls();
  await Promise.all(button.dispatch("click"));
  expect(icon.textContent).toBe("✓");
  expect(button.classList.contains("btn-success")).toBe(true);
  jest.runOnlyPendingTimers();
  expect(icon.textContent).toBe("⧉");
  expect(button.classList.contains("btn-success")).toBe(false);
  jest.useRealTimers();
});

test.each([false, true])(
  "shows an error state when clipboard access fails, icon=%s",
  async (withIcon) => {
    jest.useFakeTimers();
    const { button } = setup(
      jest.fn(async () => {
        throw new Error("blocked");
      }),
      withIcon,
    );
    initCopyControls();
    await Promise.all(button.dispatch("click"));
    expect(withIcon ? button.children[0].textContent : button.textContent).toBe(
      withIcon ? "!" : "Retry",
    );
    jest.runOnlyPendingTimers();
    expect(withIcon ? button.children[0].textContent : button.textContent).toBe(
      withIcon ? "⧉" : "Copy",
    );
    jest.useRealTimers();
  },
);
