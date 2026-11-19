# Web application and routes

The application reads the read-only repository tree and the Node.js release website. The Docker image uses `node:26-bookworm-slim` for the initial release.

## Routes

- Use `/health` and `/ready` for health checks.
- Use `/api/v1/catalog` or `/metadata/catalog.json` to read release metadata.
- Use `/api/v1/list` to request a repository directory listing.
- Browse signed RPMs under `/el10/x86_64/stable/`.
- Read `/metadata/repository-index.json` to inspect published files.

Keep package builds, RPM signing, and publication in nodejs-packaging. Keep repository data read-only in this server.

## Container operations

Build the local image with `docker compose build`. Attach the repository tree read-only at `/srv/repository`.

Set `REPOSITORY_ROOT` before you run Compose. Check `/ready` after startup. The image publishes on version tags through the GHCR workflow.
