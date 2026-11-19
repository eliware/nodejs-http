import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer, { KnownDevices } from "puppeteer";
import browserConfigModule from "../../src/e2e/browser-config.mjs";
import siteScreenshotsModule from "../../src/e2e/site-screenshots.mjs";

const browserConfig = browserConfigModule({
  environment: process.env,
  platform: process.platform,
  fileExists: existsSync,
  userId: process.getuid?.(),
});
await siteScreenshotsModule().runSiteScreenshots({
  environment: process.env,
  logger: console,
  fs: { mkdir },
  resolve,
  puppeteer,
  devices: KnownDevices,
  browserConfig,
});
