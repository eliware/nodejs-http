import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/e2e/screenshot-viewports.mjs";
const { screenshotViewports } = __moduleApi0();

test("defines desktop and iPhone screenshot sizes", () => {
  const viewports = screenshotViewports({
    viewport: { width: 390, height: 844, deviceScaleFactor: 3 },
  });
  expect(viewports.map(({ name }) => name)).toEqual([
    "desktop-1080p",
    "desktop-1440p",
    "desktop-2160p",
    "iphone-12-portrait",
    "iphone-12-landscape",
  ]);
  expect(viewports.at(-2).viewport).toEqual({ width: 390, height: 844, deviceScaleFactor: 3 });
  expect(viewports.at(-1).viewport).toEqual({
    width: 844,
    height: 390,
    deviceScaleFactor: 3,
    isLandscape: true,
  });
});
