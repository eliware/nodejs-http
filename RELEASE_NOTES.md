# Release Notes

## 15.2.1 — 2026-11-19

### Added

- Add stable RPM browsing, package lookup, and tools to compare stable releases.
- Add image inspection and deployment examples for the published CentOS Stream 10 Node.js image.
- Add an end-user site guide for packages, updates, images, and release verification.

### Changed

- Use the published CentOS Stream 10 Node.js image as the application container base.
- Refresh dependencies and document image publishing, runtime configuration, and site operations.
- Consolidate guide validation, directory metadata, response handling, and image filtering helpers.

### Fixed

- Preserve encoded characters in blog category and repository directory links.
- Validate readiness metadata and prevent guide or directory symlinks from exposing paths outside `PUBLIC_DIR`.
- Use text nodes for repository metadata and honor client encoding preferences when compressing responses.
- Return the correct error for malformed blog API paths and make `HEAD` headers match the corresponding `GET` representation.

## 15.2.0 — 2026-11-19

### Added

- Provide a read-only web frontend for published Node.js 26 RPMs and release metadata.
- Support CentOS Stream 10 EPEL packages for x86_64 systems.
- Provide repository browsing, release catalog access, installation instructions, and readiness checks.
- Include health checks, Prometheus metrics, blog pages, RSS, and a sitemap.
- Provide a container image that reads repository content from a read-only directory.
