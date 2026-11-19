import { expect, jest, test } from "@jest/globals";
import browserConfigModule from "../../src/e2e/browser-config.mjs";

function createConfig({
  environment = {},
  platform = "linux",
  fileExists = () => false,
  userId = 1000,
} = {}) {
  return browserConfigModule({ environment, platform, fileExists, userId });
}

test("selects browser arguments based on the user ID", () => {
  expect(createConfig({ userId: 0 }).browserArgs()).toEqual([
    "--no-sandbox",
    "--disable-dev-shm-usage",
  ]);
  expect(createConfig({ userId: 1000 }).browserArgs()).toEqual(["--disable-dev-shm-usage"]);
});

test("uses the configured Chrome path", async () => {
  const { chromePath } = createConfig({ environment: { CHROME_PATH: "/custom/chrome" } });
  await expect(chromePath({})).resolves.toBe("/custom/chrome");
});

test("uses a detected Linux browser before Puppeteer's browser", async () => {
  const executablePath = jest.fn(async () => "/puppeteer/chrome");
  const { chromePath } = createConfig({
    fileExists: (candidate) => candidate === "/usr/bin/chromium",
  });
  await expect(chromePath({ executablePath })).resolves.toBe("/usr/bin/chromium");
  expect(executablePath).not.toHaveBeenCalled();
});

test("uses Puppeteer's browser when no system browser exists", async () => {
  const executablePath = jest.fn(async () => "/puppeteer/chrome");
  const { chromePath } = createConfig({ platform: "darwin" });
  await expect(chromePath({ executablePath })).resolves.toBe("/puppeteer/chrome");
  expect(executablePath).toHaveBeenCalledTimes(1);
});

test("lists the production pages used by browser checks", () => {
  const { targetPages } = createConfig();
  expect(targetPages.map(({ path }) => path)).toEqual([
    "/",
    "/install",
    "/browse",
    "/el10/x86_64/stable/",
    "/blog",
    "/about",
    "/tos",
    "/policy",
  ]);
  expect(targetPages.filter(({ kind }) => kind === "blog")).toHaveLength(1);
});
