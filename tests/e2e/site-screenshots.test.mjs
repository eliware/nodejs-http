import { expect, jest, test } from "@jest/globals";
import siteScreenshotsModule from "../../src/e2e/site-screenshots.mjs";

const { runSiteScreenshots, waitForPublishedContent } = siteScreenshotsModule();

function createPage() {
  return {
    setViewport: jest.fn(async () => {}),
    goto: jest.fn(async () => {}),
    waitForFunction: jest.fn(async () => {}),
    screenshot: jest.fn(async () => {}),
  };
}

function createRunOptions(page, overrides = {}) {
  const browser = { newPage: jest.fn(async () => page), close: jest.fn(async () => {}) };
  const logger = { log: jest.fn() };
  const options = {
    environment: { E2E_BASE_URL: "https://example.test/", SCREENSHOT_OUTPUT_DIR: "shots" },
    logger,
    fs: { mkdir: jest.fn(async () => {}) },
    resolve: (...parts) => (parts.length === 1 ? `/resolved/${parts[0]}` : parts.join("/")),
    puppeteer: { launch: jest.fn(async () => browser) },
    devices: { "iPhone 12": { viewport: { width: 390, height: 844, deviceScaleFactor: 3 } } },
    browserConfig: {
      browserArgs: () => ["--no-sandbox"],
      chromePath: async () => "/chrome",
      targetPages: [{ name: "home", path: "/" }],
    },
    ...overrides,
  };
  return { options, browser, logger };
}

test("captures each viewport and closes the browser", async () => {
  const page = createPage();
  const { options, browser, logger } = createRunOptions(page);
  await runSiteScreenshots(options);
  expect(browser.newPage).toHaveBeenCalledTimes(1);
  expect(page.setViewport).toHaveBeenCalledTimes(5);
  expect(page.goto).toHaveBeenCalledTimes(5);
  expect(page.screenshot).toHaveBeenCalledTimes(10);
  expect(page.screenshot).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      path: "/resolved/shots/home-desktop-1080p-above-fold.png",
      fullPage: false,
    }),
  );
  expect(logger.log).toHaveBeenCalledTimes(5);
  expect(browser.close).toHaveBeenCalledTimes(1);
});

test("uses default URL and screenshot paths when environment values are absent", async () => {
  const page = createPage();
  const { options } = createRunOptions(page, { environment: {} });
  await runSiteScreenshots(options);
  expect(page.goto).toHaveBeenCalledWith("https://nodejs.eliware.org/", {
    waitUntil: "networkidle2",
    timeout: 60_000,
  });
  expect(options.fs.mkdir).toHaveBeenCalledWith("/resolved/artifacts/e2e-screenshots", {
    recursive: true,
  });
});

test("closes the browser when page navigation fails", async () => {
  const page = createPage();
  page.goto.mockRejectedValueOnce(new Error("navigation failed"));
  const { options, browser } = createRunOptions(page);
  await expect(runSiteScreenshots(options)).rejects.toThrow("navigation failed");
  expect(browser.close).toHaveBeenCalledTimes(1);
});

test("waits for blog article content", async () => {
  const page = { waitForFunction: jest.fn(async (callback, options, target) => callback(target)) };
  const oldDocument = globalThis.document;
  globalThis.document = {
    querySelector: (selector) =>
      selector === "#blog-article" ? { classList: { contains: () => false } } : null,
    querySelectorAll: () => [],
  };
  try {
    await expect(waitForPublishedContent(page, { name: "article", kind: "blog" })).resolves.toBe(
      true,
    );
    expect(page.waitForFunction).toHaveBeenCalledWith(
      expect.any(Function),
      { timeout: 15_000 },
      {
        name: "article",
        kind: "blog",
      },
    );
  } finally {
    globalThis.document = oldDocument;
  }
});

test("waits for a loaded blog listing", async () => {
  const page = { waitForFunction: jest.fn(async (callback, options, target) => callback(target)) };
  const oldDocument = globalThis.document;
  globalThis.document = {
    querySelector: (selector) => (selector === "#blog-status" ? { textContent: "Loaded" } : null),
    querySelectorAll: () => [{}],
  };
  try {
    await expect(waitForPublishedContent(page, { name: "blog", kind: "blog" })).resolves.toBe(true);
  } finally {
    globalThis.document = oldDocument;
  }
});

test("waits for homepage package and release content", async () => {
  const page = { waitForFunction: jest.fn(async (callback, options, target) => callback(target)) };
  const oldDocument = globalThis.document;
  globalThis.document = {
    querySelector: (selector) => {
      if (selector === "#package-search-status") return { textContent: "Loaded" };
      if (selector === "#release-timeline")
        return { querySelector: () => ({}), textContent: "Ready" };
      return null;
    },
  };
  try {
    await expect(waitForPublishedContent(page, { name: "homepage" })).resolves.toBe(true);
  } finally {
    globalThis.document = oldDocument;
  }
});

test("waits for directory entries and titles", async () => {
  const page = { waitForFunction: jest.fn(async (callback, options, target) => callback(target)) };
  const oldDocument = globalThis.document;
  globalThis.document = {
    querySelector: (selector) => {
      if (selector === "#directory-entries, .directory-card table tbody, table tbody") {
        return { querySelector: () => ({}) };
      }
      if (selector === "#directory-title") return { textContent: "Packages" };
      return null;
    },
  };
  try {
    await expect(waitForPublishedContent(page, { name: "directory" })).resolves.toBe(true);
  } finally {
    globalThis.document = oldDocument;
  }
});
