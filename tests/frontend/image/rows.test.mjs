import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/rows.mjs";
const { renderFolderRow, renderImageRow } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

test("renders a clickable image folder row", () => {
  const list = new BrowserElement("div");
  const onOpen = jest.fn();
  installBrowserDom();
  renderFolderRow(list, "ghcr.io/eliware/rocky10-gluster", () => 3, onOpen);
  expect(list.children[0].children[0].children[0].children[0].textContent).toBe("rocky10-gluster/");
  const button = list.children[0].children[0];
  button.dispatch("click");
  expect(onOpen).toHaveBeenCalledWith("ghcr.io/eliware/rocky10-gluster");
});

test("renders an image row and opens its example", () => {
  const list = new BrowserElement("div");
  const showExample = jest.fn();
  installBrowserDom();
  renderImageRow(
    list,
    {
      channel: "rolling",
      version: "10.2",
      distroLabel: "Rocky",
      release: "10",
      arch: "x86_64",
      built: "today",
      image: { reference: "image:tag", digest: "sha256:abc" },
    },
    showExample,
    () => "built time",
    () => "commit",
  );
  const article = list.children[0];
  expect(article.children[0].children[0].textContent).toContain("Rolling");
  expect(article.children[1].textContent).toContain("commit");
  expect(article.children[2].children[0].textContent).toBe("image:tag");
  article.dispatch("click");
  expect(showExample).toHaveBeenCalledWith(
    expect.objectContaining({ version: "10.2" }),
    "dockerfile",
  );
});
