# Repository metadata

The nodejs-packaging project owns package builds, RPM signing, metadata creation, and repository publication. This application reads the published tree and does not write to it.

Set `PUBLIC_DIR` to the published repository path. In the production container, attach it at `/srv/repository` as read-only. The tree includes signed RPMs, repository metadata, release metadata, guide documents, and optional blog content.

The application checks `metadata_version` before it returns supported catalog, index, active generation, generation, blog, and validation documents. It rejects invalid metadata. Keep repository metadata aligned with the [release contract](https://github.com/eliware/nodejs-packaging/blob/main/specs/release-contract.md).

## Readiness files

`/ready` and `/readyz` require these files:

- `metadata/catalog.json`
- `metadata/repository-index.json`
- `metadata/active-generation.json`
- `.generations/<generation>/generation.json`, where `<generation>` matches the active generation value

Every file must contain the supported `metadata_version`. The readiness response reports `ready` and the generation identifier when all checks pass. It returns HTTP 503 with `not-ready` when any file is missing, invalid, or inconsistent.

## Repository index

The repository index supplies directory entries and optional validation records to `/api/v1/list` and the sitemap. When an index has no entry for a requested directory, the application can inspect the mounted directory tree directly. Listings exclude dotfiles unless `ALLOW_DOTFILES` is enabled.

## Content ownership

Keep package building, signing, repository updates, active generation changes, and metadata publication in nodejs-packaging. Keep the nodejs-http repository path read-only so web requests cannot change published files.
