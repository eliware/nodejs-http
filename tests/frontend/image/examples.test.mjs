import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/examples.mjs";
const { renderImageExample } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

const record = {
  repository: "ghcr.io/eliware/rocky10-gluster",
  image: {
    repository: "ghcr.io/eliware/rocky10-gluster",
    digest: "sha256:123",
    reference: "ghcr.io/eliware/rocky10-gluster:10",
  },
};

test("returns when the example or panel elements are unavailable", () => {
  installBrowserDom();
  renderImageExample(null, "latest");
  renderImageExample({ record, kind: "dockerfile" }, "latest");
});

test.each([
  ["dockerfile", "FROM ghcr.io/eliware/rocky10-gluster:latest"],
  ["compose", "services:"],
  ["kubernetes", "apiVersion: apps/v1"],
])("renders the %s example", (kind, expected) => {
  const reference = new BrowserElement("button");
  reference.dataset.imageExampleReference = "sha";
  const activeReference = new BrowserElement("button");
  activeReference.dataset.imageExampleReference = "latest";
  const kindButton = new BrowserElement("button");
  kindButton.dataset.imageExampleKind = kind;
  const { get } = installBrowserDom({
    ids: ["image-example-panel", "image-example-title", "image-example-code"],
    groups: {
      "[data-image-example-reference]": [reference, activeReference],
      "[data-image-example-kind]": [kindButton],
    },
  });
  renderImageExample({ record, kind }, "latest");
  expect(get("image-example-panel").hidden).toBe(false);
  expect(get("image-example-title").textContent).toContain("rocky10-gluster");
  if (kind === "dockerfile")
    expect(get("image-example-code").textContent).toContain(
      "FROM ghcr.io/eliware/rocky10-gluster:latest",
    );
  else expect(get("image-example-code").textContent).toContain(expected);
  expect(activeReference.classList.contains("active")).toBe(true);
  expect(kindButton.classList.contains("active")).toBe(true);
});

test("uses digest and tag references", () => {
  const { get } = installBrowserDom({
    ids: ["image-example-panel", "image-example-title", "image-example-code"],
  });
  renderImageExample({ record, kind: "dockerfile" }, "sha");
  expect(get("image-example-code").textContent).toContain("@sha256:123");
  renderImageExample({ record, kind: "dockerfile" }, "tag");
  expect(get("image-example-code").textContent).toContain(":10");
});
