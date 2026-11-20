import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/frontend/release/wizard/release-summary.mjs";
const { populateVersionOptions, updateReleaseSummary } = __moduleApi0();
import { wizardState } from "../../../../src/frontend/release/wizard/state.mjs";
import { installBrowserDom } from "../../../../test-fixtures/browser-dom.mjs";

test("populates the stable version option", () => {
  const { get } = installBrowserDom({ ids: ["target-version"] });
  wizardState.catalog = { stable: { latest: { node_version: "26.13.2" } } };
  populateVersionOptions();
  expect(get("target-version").options[0]).toMatchObject({
    value: "stable",
    textContent: "Latest stable (26.13.2)",
  });
  wizardState.catalog = { stable: {} };
  populateVersionOptions();
  expect(get("target-version").options[0].textContent).toBe("No stable release available");
});

test("renders release version, build time, and status", () => {
  const { get } = installBrowserDom({ ids: ["release", "built", "release-status"] });
  updateReleaseSummary({ stable: { version: "26.13.1", built: "2026-01-01T00:00:00Z" } });
  expect(get("release").textContent).toBe("26.13.1");
  expect(get("built").textContent).not.toBe("Validated");
  expect(get("release-status").textContent).toBe("Latest stable release: Node.js 26.13.1.");
  updateReleaseSummary({ stable: {} });
  expect(get("release").textContent).toBe("unavailable");
  expect(get("built").textContent).toBe("Validated");
});

test("supports latest release metadata and missing summary elements", () => {
  const { get } = installBrowserDom({
    ids: ["target-version", "release", "built", "release-status"],
  });
  wizardState.catalog = { stable: { latest: { version: "26.13.2", generated: "2026-01-02" } } };
  populateVersionOptions();
  expect(get("target-version").options[0].textContent).toContain("26.13.2");
  updateReleaseSummary({ stable: { latest: { version: "26.13.2", generated: "2026-01-02" } } });
  expect(get("built").textContent).not.toBe("Validated");
  installBrowserDom();
  expect(() => updateReleaseSummary({})).not.toThrow();
  expect(() => populateVersionOptions()).not.toThrow();
});
