import { expect, test } from "@jest/globals";
import { installBrowserDom } from "../../../../test-fixtures/browser-dom.mjs";
import __moduleApi0 from "../../../../src/frontend/release/wizard/image-commands.mjs";
const { setImageReferenceMode, updateContainerCommand } = __moduleApi0();
import { wizardState } from "../../../../src/frontend/release/wizard/state.mjs";

globalThis.location = { origin: "https://repo.example" };

test("updates image reference output and selection state", () => {
  const { get } = installBrowserDom({
    ids: ["target-channel", "target-version", "image-ref", "image-digest", "image-repository-link"],
  });
  get("target-channel").value = "stable";
  get("target-version").value = "stable";
  wizardState.catalog = {
    stable: {
      image: {
        reference: "ghcr.io/eliware/centos10-node26:26.13.1",
        digest: "sha256:stable",
        repository: "ghcr.io/eliware/centos10-node26",
      },
    },
  };
  setImageReferenceMode("tag");
  updateContainerCommand();
  expect(get("image-ref").textContent).toContain("centos10-node26");
  expect(get("image-digest").textContent).toBe("sha256:stable");
  expect(get("image-repository-link").href).toBe("https://ghcr.io/eliware/centos10-node26");
});

test("handles absent optional image output controls", () => {
  const { get } = installBrowserDom({ ids: ["target-channel", "target-version"] });
  get("target-channel").value = "stable";
  get("target-version").value = "stable";
  wizardState.catalog = {};
  updateContainerCommand();
});
