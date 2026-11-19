async function runLighthouse({
  environment,
  logger,
  fs,
  paths,
  launch: startChrome,
  lighthouse: runAudit,
  generateReport: createReport,
  puppeteer: browser,
  browserConfig: { browserArgs, chromePath, targetPages },
}) {
  const baseUrl = (environment.E2E_BASE_URL ?? "https://nodejs.eliware.org").replace(/\/$/, "");
  const outputDir = paths.resolve(environment.LIGHTHOUSE_OUTPUT_DIR ?? "artifacts/lighthouse");
  const formFactor = environment.LIGHTHOUSE_FORM_FACTOR === "mobile" ? "mobile" : "desktop";
  const isMobile = formFactor === "mobile";
  const throttlingMethod = environment.LIGHTHOUSE_THROTTLING ?? "provided";
  const chrome = await startChrome({
    chromePath: await chromePath(browser),
    chromeFlags: ["--headless", ...browserArgs()],
  });

  try {
    await fs.mkdir(outputDir, { recursive: true });
    for (const target of targetPages) {
      const result = await runAudit(`${baseUrl}${target.path}`, {
        port: chrome.port,
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        throttlingMethod,
        formFactor,
        screenEmulation: {
          mobile: isMobile,
          width: isMobile ? 390 : 1440,
          height: isMobile ? 844 : 1000,
          deviceScaleFactor: isMobile ? 2 : 1,
        },
      });
      if (!result?.lhr) throw new Error(`Lighthouse did not return a result for ${target.name}`);
      await fs.writeFile(
        paths.join(outputDir, `${target.name}.html`),
        createReport(result.lhr, "html"),
      );
      await fs.writeFile(
        paths.join(outputDir, `${target.name}.json`),
        `${JSON.stringify(result.lhr, null, 2)}\n`,
      );
      const scores = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([category, value]) => [
          category,
          value.score == null ? null : Math.round(value.score * 100),
        ]),
      );
      logger.log(`${target.name} (${formFactor}, ${throttlingMethod}): ${JSON.stringify(scores)}`);
    }
    logger.log(`Lighthouse reports written to ${outputDir}`);
  } finally {
    chrome.kill();
  }
}

export default function lighthouseModule() {
  return { runLighthouse };
}
