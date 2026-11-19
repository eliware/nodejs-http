import { expect, jest, test } from "@jest/globals";

const initCopyControls = jest.fn();
const initDirectoryBrowser = jest.fn();
const initImageBrowser = jest.fn();
const initPanels = jest.fn();
const initReleaseWizard = jest.fn();
const initReleaseExperience = jest.fn();
const initValidationMatrix = jest.fn();
const initBlog = jest.fn();
const whenVisible = jest.fn(async () => {});
const directoryStatus = { textContent: "" };
whenVisible.mockImplementationOnce(() => Promise.reject(new Error("offline")));

globalThis.document = {
  getElementById: jest.fn((id) => (id === "directory-status" ? directoryStatus : null)),
};
jest.unstable_mockModule("../../src/frontend/styles.css", () => ({}));
jest.unstable_mockModule("../../src/frontend/copy-controls.mjs", () => ({
  default: () => ({ initCopyControls }),
}));
jest.unstable_mockModule("../../src/frontend/directory-browser.mjs", () => ({
  default: () => ({ initDirectoryBrowser }),
}));
jest.unstable_mockModule("../../src/frontend/image-browser.mjs", () => ({
  default: () => ({ initImageBrowser }),
}));
jest.unstable_mockModule("../../src/frontend/panels.mjs", () => ({
  default: () => ({ initPanels }),
}));
jest.unstable_mockModule("../../src/frontend/release/wizard.mjs", () => ({
  default: () => ({ initReleaseWizard }),
}));
jest.unstable_mockModule("../../src/frontend/release/experience.mjs", () => ({
  default: () => ({ initReleaseExperience }),
}));
jest.unstable_mockModule("../../src/frontend/validation-matrix.mjs", () => ({
  default: () => ({ initValidationMatrix }),
}));
jest.unstable_mockModule("../../src/frontend/blog.mjs", () => ({ default: () => ({ initBlog }) }));
jest.unstable_mockModule("../../src/frontend/dom.mjs", () => ({
  default: () => ({ whenVisible }),
}));
await import("../../src/frontend/app.mjs");

test("starts controls and reports a failed visible panel load", async () => {
  await Promise.resolve();
  expect(initCopyControls).toHaveBeenCalledTimes(1);
  expect(initPanels).toHaveBeenCalledTimes(1);
  expect(initReleaseWizard).toHaveBeenCalledTimes(1);
  expect(initBlog).toHaveBeenCalledTimes(1);
  expect(whenVisible).toHaveBeenCalledTimes(4);
  expect(directoryStatus.textContent).toBe("Directory metadata is temporarily unavailable.");
  await whenVisible.mock.calls[0][1]();
  expect(initDirectoryBrowser).toHaveBeenCalled();
});

test("ignores directory load failures when the status element is absent", async () => {
  globalThis.document.getElementById.mockReturnValue(null);
  whenVisible.mockImplementationOnce(() => Promise.reject(new Error("offline")));
  await import("../../src/frontend/app.mjs?without-status");
  await Promise.resolve();
});
