import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/frontend/image/rows/folder.mjs";
const { renderFolderRow } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../../../test-fixtures/browser-dom.mjs";

test("renders a clickable image folder row", () => {
  const list = new BrowserElement("div");
  const onOpen = jest.fn();
  installBrowserDom();
  renderFolderRow(list, "ghcr.io/eliware/rocky10-gluster", () => 3, onOpen);
  expect(list.children[0].children[0].children[0].children[0].textContent).toBe("rocky10-gluster/");
  expect(list.children[0].children[0].children[0].children[1].textContent).toBe("3 images");
  list.children[0].children[0].dispatch("click");
  expect(onOpen).toHaveBeenCalledWith("ghcr.io/eliware/rocky10-gluster");
});
