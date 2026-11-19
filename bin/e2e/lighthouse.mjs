import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { launch } from "chrome-launcher";
import lighthouse, { generateReport } from "lighthouse";
import puppeteer from "puppeteer";
import browserConfigModule from "../../src/e2e/browser-config.mjs";
import lighthouseModule from "../../src/e2e/lighthouse.mjs";

const config = browserConfigModule({
  environment: process.env,
  platform: process.platform,
  fileExists: existsSync,
  userId: process.getuid?.(),
});
await lighthouseModule().runLighthouse({
  environment: process.env,
  logger: console,
  fs: { mkdir, writeFile },
  paths: { join, resolve },
  launch,
  lighthouse,
  generateReport,
  puppeteer,
  browserConfig: config,
});
