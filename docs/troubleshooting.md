# Troubleshooting

## The server cannot read repository files

Check that `PUBLIC_DIR` points to the repository root. Check that the process can read the path and its files. In Compose, set `REPOSITORY_ROOT` before startup.

## Readiness returns HTTP 503

Check that catalog, repository index, active generation, and generation files exist under `PUBLIC_DIR`. Confirm that all documents use the supported metadata version. Confirm that the generation identifier matches in the active and generation documents.

## The release page has no current release

Check `/metadata/catalog.json` and `/api/v1/catalog`. Confirm that nodejs-packaging published a stable release and updated the catalog.

## A repository directory returns HTTP 404

Check that the requested path exists under `PUBLIC_DIR`. Check the repository index entry or the physical directory. Verify that the path does not contain a blocked dotfile or symbolic link.

## A blog or guide returns HTTP 404 or 503

Check `BLOG_DIR` or the expected guide path under `PUBLIC_DIR`. Validate blog files with `npm run check:blogs`. Guide documents must match the required schema and the requested action, OS, and channel.

## The container does not start

Run `docker compose ps` and `docker compose logs web`. Confirm that `REPOSITORY_ROOT` names an existing directory and that port 7001 is available on localhost.
