# Sitemap and browser checks

The application generates `/sitemap.xml` from public pages, repository directories, and published blog posts. It generates canonical URLs from the configured site URL. Check sitemap output after changing route names or the production hostname.

Set `E2E_BASE_URL` to a running website URL before using `npm run lighthouse` or `npm run screenshots`. Set `LIGHTHOUSE_THROTTLING` to `provided` or `simulate` when selecting a Lighthouse mode. The scripts do not start the application.

Run `npm run test:e2e:lighthouse` for Lighthouse checks. Run `npm run screenshots` to capture site screenshots. These commands require the browser dependencies installed by npm.
