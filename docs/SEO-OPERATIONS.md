# Sitemap and browser checks

The application generates `/sitemap.xml` from public pages, repository directories, and published blog posts. It generates canonical URLs from the configured site URL. Check sitemap output after changing route names or the production hostname.

Set `E2E_BASE_URL` to a running website URL before you run browser checks. The default URL is `https://nodejs.eliware.org`. The scripts do not start the application.

The screenshot command captures `/`, `/install`, `/browse`, `/el10/x86_64/stable/`, `/blog`, `/about`, `/tos`, and `/policy`. It saves above-fold and full-page images at three desktop sizes and two iPhone 12 sizes.

Run `npm run screenshots` to save images under `artifacts/e2e-screenshots/`. Set `SCREENSHOT_OUTPUT_DIR` to change the output directory.

Run `npm run lighthouse` to save HTML and JSON reports under `artifacts/lighthouse/`. The command audits the same eight pages on desktop by default. Set `LIGHTHOUSE_OUTPUT_DIR` to change the output directory. Set `LIGHTHOUSE_FORM_FACTOR=mobile` to use a 390 by 844 mobile viewport.

Set `LIGHTHOUSE_THROTTLING=provided` to use observed network conditions. Set it to `simulate` to use simulated network throttling. Run `npm run test:e2e:lighthouse:provided`, `npm run test:e2e:lighthouse:simulated`, `npm run test:e2e:lighthouse:mobile`, or `npm run test:e2e:lighthouse:mobile:simulated` to use these presets.

Install dependencies with `npm ci` before you run browser checks. Puppeteer uses its downloaded Chrome browser unless `CHROME_PATH` or a supported system browser is available.
