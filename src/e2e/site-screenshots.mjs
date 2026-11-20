import screenshotViewportsApi from "./screenshot-viewports.mjs";
const { screenshotViewports } = screenshotViewportsApi();

async function waitForPublishedContent(page, target) {
  return page.waitForFunction(
    ({ name, kind }) => {
      if (kind === "blog") {
        const status = document.querySelector("#blog-status")?.textContent;
        const article = document.querySelector("#blog-article");
        const articleReady = article && !article.classList.contains("d-none");
        return Boolean(articleReady || (status && !status.includes("Loading")));
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
      if (kind === "install") {
        const command = document.querySelector("#rpm-command")?.textContent;
        return Boolean(command && !command.includes("Loading"));
      }
      if (kind === "browser") {
        const title = document.querySelector("#directory-title")?.textContent;
        const status = document.querySelector("#directory-status")?.textContent;
        return Boolean(
          title && !title.includes("Loading") && status && !status.includes("Loading"),
        );
      }
      if (kind === "information") return Boolean(document.querySelector("main h1"));
      const entries = document.querySelector(".directory-card table tbody, table tbody");
      const title = document.querySelector(".directory-hero h1")?.textContent;
      return Boolean(title && entries?.querySelector("tr"));
    },
    { timeout: 15_000 },
    target,
  );
}

async function loadPageSections(page, target) {
  if (target.name !== "homepage") return null;
  return page.evaluate(async () => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const step = Math.max(400, Math.round(window.innerHeight * 0.75));
    for (let top = 0; top < root.scrollHeight; top += step) {
      window.scrollTo(0, top);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    root.style.scrollBehavior = previousScrollBehavior;
    return window.scrollY;
  });
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
  const viewports = screenshotViewports(iphone12);
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
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
        const scrollPosition = await loadPageSections(page, target);
        if (scrollPosition !== null && scrollPosition !== 0) {
          throw new Error(`The ${target.name} screenshot did not return to the top of the page`);
        }
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
  return { loadPageSections, runSiteScreenshots, waitForPublishedContent };
}
