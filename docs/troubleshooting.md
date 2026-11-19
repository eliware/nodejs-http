# Troubleshooting

## The server cannot read repository data

Set `PUBLIC_DIR` to the attached nodejs-repository tree. Check that the server account can read the directory and metadata files.

## Readiness returns an error

Check that the catalog, repository index, active generation record, and generation file exist. Confirm that every metadata document uses the supported schema version.

## The site does not show a release

Check `/metadata/catalog.json`. Confirm that the packaging pipeline published a stable release and that the catalog points to its generation.
