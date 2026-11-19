import { expect, jest, test } from "@jest/globals";
import lighthouseModule from "../../src/e2e/lighthouse.mjs";

const { runLighthouse } = lighthouseModule();

function createOptions(environment = {}) {
  const chrome = { port: 9222, kill: jest.fn() };
  const startChrome = jest.fn(async () => chrome);
  const runAudit = jest.fn(async () => ({
    lhr: { categories: { performance: { score: 0.91 }, seo: { score: null } } },
  }));
  const fs = { mkdir: jest.fn(async () => {}), writeFile: jest.fn(async () => {}) };
  const logger = { log: jest.fn() };
  const options = {
    environment,
    logger,
    fs,
    paths: { resolve: (path) => `/resolved/${path}`, join: (...parts) => parts.join("/") },
    launch: startChrome,
    lighthouse: runAudit,
    generateReport: jest.fn(() => "html report"),
    puppeteer: { executablePath: jest.fn(async () => "/chrome") },
    browserConfig: {
      browserArgs: () => ["--no-sandbox"],
      chromePath: async () => "/chrome",
      targetPages: [{ name: "home", path: "/" }],
    },
  };
  return { options, chrome, startChrome, runAudit, fs, logger };
}

test("writes desktop reports and logs normalized scores", async () => {
  const { options, chrome, startChrome, runAudit, fs, logger } = createOptions({});
  await runLighthouse(options);
  expect(startChrome).toHaveBeenCalledWith({
    chromePath: "/chrome",
    chromeFlags: ["--headless", "--no-sandbox"],
  });
  expect(runAudit).toHaveBeenCalledWith(
    "https://nodejs.eliware.org/",
    expect.objectContaining({
      formFactor: "desktop",
      screenEmulation: { mobile: false, width: 1440, height: 1000, deviceScaleFactor: 1 },
    }),
  );
  expect(fs.mkdir).toHaveBeenCalledWith("/resolved/artifacts/lighthouse", { recursive: true });
  expect(fs.writeFile).toHaveBeenCalledTimes(2);
  expect(logger.log).toHaveBeenCalledWith(
    'home (desktop, provided): {"performance":91,"seo":null}',
  );
  expect(logger.log).toHaveBeenLastCalledWith(
    "Lighthouse reports written to /resolved/artifacts/lighthouse",
  );
  expect(chrome.kill).toHaveBeenCalledTimes(1);
});

test("uses mobile settings and configured report options", async () => {
  const { options, runAudit } = createOptions({
    E2E_BASE_URL: "https://example.test/",
    LIGHTHOUSE_OUTPUT_DIR: "reports/mobile",
    LIGHTHOUSE_FORM_FACTOR: "mobile",
    LIGHTHOUSE_THROTTLING: "simulate",
  });
  await runLighthouse(options);
  expect(runAudit).toHaveBeenCalledWith(
    "https://example.test/",
    expect.objectContaining({
      formFactor: "mobile",
      throttlingMethod: "simulate",
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 },
    }),
  );
});

test("rejects missing Lighthouse results and still closes Chrome", async () => {
  const { options, chrome, runAudit } = createOptions({});
  runAudit.mockResolvedValueOnce(undefined);
  await expect(runLighthouse(options)).rejects.toThrow(
    "Lighthouse did not return a result for home",
  );
  expect(chrome.kill).toHaveBeenCalledTimes(1);
});
