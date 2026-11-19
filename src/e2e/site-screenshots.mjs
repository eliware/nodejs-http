async function waitForPublishedContent(page, target) {
  return page.waitForFunction(
    ({ name, kind }) => {
      if (kind === "blog") {
        const status = document.querySelector("#blog-status")?.textContent;
        const article = document.querySelector("#blog-article");
        const posts = document.querySelectorAll("#blog-list .blog-card");
        const articleReady = article && !article.classList.contains("d-none");
        const listingReady = posts.length > 0 && status && !status.includes("Loading");
        return Boolean(articleReady || listingReady);
      }
      if (name === "homepage") {
        const packageStatus = document.querySelector("#package-search-status")?.textContent;
        const timeline = document.querySelector("#release-timeline");
        return (
          packageStatus &&
          !packageStatus.includes("Loading") &&
          timeline?.querySelector("li") &&
          !timeline.textContent.includes("Loading")
        );
      }
      const entries = document.querySelector(
        "#directory-entries, .directory-card table tbody, table tbody",
      );
      const title = document.querySelector("#directory-title")?.textContent;
      return Boolean(title && entries?.querySelector("tr"));
    },
    { timeout: 15_000 },
    target,
  );
}

async function runSiteScreenshots({
  environment,
  logger,
  fs,
  resolve: resolvePath,
  puppeteer: browserLibrary,
  devices,
  browserConfig: { browserArgs, chromePath, targetPages },
}) {
  const baseUrl = (environment.E2E_BASE_URL ?? "https://nodejs.eliware.org").replace(/\/$/, "");
  const outputDir = resolvePath(environment.SCREENSHOT_OUTPUT_DIR ?? "artifacts/e2e-screenshots");
  const iphone12 = devices["iPhone 12"];
  const viewports = [
    { name: "desktop-1080p", viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 } },
    { name: "desktop-1440p", viewport: { width: 2560, height: 1440, deviceScaleFactor: 1 } },
    { name: "desktop-2160p", viewport: { width: 3840, height: 2160, deviceScaleFactor: 1 } },
    { name: "iphone-12-portrait", viewport: iphone12.viewport },
    {
      name: "iphone-12-landscape",
      viewport: {
        ...iphone12.viewport,
        width: iphone12.viewport.height,
        height: iphone12.viewport.width,
        isLandscape: true,
      },
    },
  ];
  const browser = await browserLibrary.launch({
    executablePath: await chromePath(browserLibrary),
    headless: true,
    args: browserArgs(),
  });

  try {
    await fs.mkdir(outputDir, { recursive: true });
    const page = await browser.newPage();
    for (const viewport of viewports) {
      await page.setViewport(viewport.viewport);
      for (const target of targetPages) {
        const url = `${baseUrl}${target.path}`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 });
        await waitForPublishedContent(page, target);
        const fileStem = `${target.name}-${viewport.name}`;
        await page.screenshot({
          path: resolvePath(outputDir, `${fileStem}-above-fold.png`),
          fullPage: false,
        });
        await page.screenshot({
          path: resolvePath(outputDir, `${fileStem}-full-page.png`),
          fullPage: true,
        });
        logger.log(`Screenshots written for ${url} at ${viewport.name}`);
      }
    }
  } finally {
    await browser.close();
  }
}

export default function siteScreenshotsModule() {
  return { runSiteScreenshots, waitForPublishedContent };
}
