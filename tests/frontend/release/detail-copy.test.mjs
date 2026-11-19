import { expect, jest, test } from "@jest/globals";
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";
import __moduleApi0 from "../../../src/frontend/release/detail-copy.mjs";
const { initDetailCopy } = __moduleApi0();

test("copies package details and clears its success state", async () => {
  const button = new BrowserElement("button");
  button.dataset.packageDetailCopy = "package-detail-command";
  const { get } = installBrowserDom({
    ids: ["package-detail-command"],
    groups: { "[data-package-detail-copy]": [button] },
  });
  get("package-detail-command").textContent = "dnf install eliware-node26";
  globalThis.navigator = { clipboard: { writeText: jest.fn(async () => {}) } };
  jest.useFakeTimers();
  initDetailCopy();
  await button.dispatch("click")[0];
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith(
    "dnf install eliware-node26",
  );
  expect(button.classList.contains("btn-success")).toBe(true);
  jest.advanceTimersByTime(2500);
  expect(button.classList.contains("btn-success")).toBe(false);
  jest.useRealTimers();
});

test("ignores copy buttons without a matching target", async () => {
  const button = new BrowserElement("button");
  button.dataset.packageDetailCopy = "missing-target";
  installBrowserDom({ groups: { "[data-package-detail-copy]": [button] } });
  globalThis.navigator = { clipboard: { writeText: jest.fn(async () => {}) } };
  initDetailCopy();
  await button.dispatch("click")[0];
  expect(globalThis.navigator.clipboard.writeText).not.toHaveBeenCalled();
});
