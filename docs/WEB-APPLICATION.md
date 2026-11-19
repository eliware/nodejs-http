# Web application and HTTP routes

The server accepts GET and `HEAD` requests by default. It returns 405 for other methods. `HEAD` returns response headers without a body.

## Pages

| Path                        | Result                                                               |
| --------------------------- | -------------------------------------------------------------------- |
| `/`                         | Main Node.js release page.                                           |
| `/browse`                   | Repository browser page.                                             |
| `/install` and `/upgrade`   | Node.js installation page.                                           |
| `/about`                    | Project information page.                                            |
| `/terms` and `/tos`         | Terms page.                                                          |
| `/policy`                   | Policy page.                                                         |
| `/blog`                     | Published post list.                                                 |
| `/blog/category/<category>` | Published posts in a category.                                       |
| `/blog/<slug>`              | One published post.                                                  |
| `/blogs`                    | Redirect to `/blog`.                                                 |
| `/feed.xml`                 | RSS 2.0 XML for published posts.                                     |
| `/sitemap.xml`              | Sitemap for site pages, repository directories, and published posts. |

The install page describes the Node.js 26 RPM for CentOS Stream 10 EPEL on x86_64. The RPM name is `eliware-nodejs26`. The command names are `node26`, `npm26`, and `npx26`.

## Repository files

The server reads repository files under `PUBLIC_DIR`. Metadata is available under `/metadata/`, and RPM files are available under `/el10/x86_64/`. Directory requests use `INDEX_FILE`, or use the listing template when directory listings are enabled.

Repository file responses support conditional requests with ETag and Last-Modified headers when enabled. They support byte ranges when enabled. Responses include `X-Request-ID`. Browser protection headers, compression, and cache behavior follow [configuration](CONFIGURATION.md).

## Health and metrics

| Path                     | Result                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `/health` and `/healthz` | Returns HTTP 200 with `{"status":"ok"}` when the process handles the request.                                       |
| `/ready` and `/readyz`   | Returns HTTP 200 when repository metadata passes readiness checks, or HTTP 503 when checks fail.                    |
| `/metrics`               | Returns Prometheus text metrics for request counts, active requests, response bytes, total time, status, and paths. |

Readiness requires valid `metadata/catalog.json`, `metadata/repository-index.json`, `metadata/active-generation.json`, and `.generations/<generation>/generation.json` files under `PUBLIC_DIR`. Each document must use the supported metadata version, and the active generation must match its generation document.

## JSON API

| Path                                  | Query or result                                                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `/api/v1/catalog`                     | Returns the validated release catalog. Returns HTTP 503 when the catalog is unavailable or has an unsupported schema version. |
| `/api/v1/list`                        | Accepts `path`, `q`, `sort`, `order`, `offset`, and `limit` query parameters.                                                 |
| `/api/guides/<action>/<os>/<channel>` | Returns a published install or upgrade guide when a matching guide document exists.                                           |
| `/api/v1/blogs`                       | Returns the published post list, count, and metadata version.                                                                 |
| `/api/v1/blogs/<slug>`                | Returns one published post with safe HTML.                                                                                    |

The list API defaults to the repository root, name sorting, ascending order, offset zero, and a limit of 500. It supports `name`, `size`, or `modified` sorting and `asc` or `desc` order. The server caps the limit at 500. Name filtering ignores letter case.

The list API returns a path, total entry count, offset, limit, `hasMore`, entries, validation data, and container validation data. It returns HTTP 404 when the requested directory does not exist.

## Static files and builds

The image copies `templates/` into `/opt/nodejs-http/site` and copies `public/assets/` into its `assets/` directory. It serves those files from `STATIC_DIR`. Repository files remain in the read-only repository path.

Run `npm run build` to create the optional browser bundle in `dist/`. The production image does not include or require that bundle. See [usage](usage.md) for container commands.
