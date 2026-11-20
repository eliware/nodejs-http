# Release Notes

## 15.2.2 — 2026-11-20

### Added

- Add a published stable repository fixture and verify catalog output against package metadata.

### Changed

- Clarify the stable release catalog and unavailable preview state in metadata integration guidance.
- Refresh browser compatibility data dependencies.

## 15.2.1 — 2026-11-19

### Added

- Add stable Node.js package browsing, package lookup, and tools to compare releases.
- Add image inspection and Dockerfile, Compose, and Kubernetes deployment examples for the CentOS Stream 10 Node.js image.
- Add installation and upgrade guide validation for supported operating systems and release channels.
- Add blog document checks, category filtering, reading-time labels, and browser tools for screenshots and Lighthouse reports.

### Changed

- Use the published CentOS Stream 10 Node.js image as the application container base.
- Refresh dependencies and expand documentation for installation, configuration, image publication, and site operations.
- Split backend configuration, request handling, response formatting, page tokens, and frontend rendering into focused modules.
- Cache blog file contents using file metadata and document the blog collection envelope schema.

### Fixed

- Preserve encoded route characters and reject repository paths outside the configured root across supported platforms.
- When symbolic links are enabled, list regular files and directories only.
- Validate upgrade guides with their requested action and guard guide reads against path replacement.
- Escape page metadata and configured version values, and require blog hero images to use local asset paths.
- Apply category filters to blog routes, reject malformed directory pagination values, and preserve valid defaults.
- Honor explicit compression exclusions, return correct errors for malformed blog paths, and return the same headers for GET and bodyless requests.

## 15.2.0 — 2026-11-19

### Added

- Provide a read-only web frontend for published Node.js 26 RPMs and release metadata.
- Support CentOS Stream 10 EPEL packages for x86_64 systems.
- Provide repository browsing, release catalog access, installation instructions, and readiness checks.
- Include health checks, Prometheus metrics, blog pages, RSS, and a sitemap.
- Provide a container image that reads repository content from a read-only directory.
