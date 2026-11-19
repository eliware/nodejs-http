import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/frontend/panels.mjs";
const { initPanels } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

test("selects a panel and hides the other panels", () => {
  const button = new BrowserElement("button");
  button.dataset.panel = "details";
  const other = new BrowserElement("button");
  const panel = new BrowserElement("section");
  panel.className = "panel d-none";
  const state = installBrowserDom({
    ids: [],
    groups: { "[data-panel]": [button, other], ".panel": [panel] },
  });
  state.elements.set("details", panel);
  initPanels();
  button.dispatch("click");
  expect(button.classList.contains("active")).toBe(true);
  expect(button.getAttribute("aria-selected")).toBe("true");
  expect(other.getAttribute("aria-selected")).toBe("false");
  expect(panel.classList.contains("d-none")).toBe(false);
  expect(state.get("details")).toBe(panel);
});
