# Release Notes

## 15.2.2 — 2026-11-20

### Added

- Add published stable repository fixtures and compare catalog responses with package metadata.
- Add focused modules for guide source validation, code fences, image rows, route families, and release wizard summaries.

### Changed

- Update the package version to 15.2.2 and refresh npm dependencies and browser compatibility data.
- Use the published CentOS Stream 10 Node.js image tag in the application build and runtime stages.
- Organize blog, directory, health, sitemap, request, configuration, and release rendering code by responsibility.
- Update metadata guidance for stable catalog availability and the published image guide for release v15.2.2.

### Fixed

- Require guide source references to use valid HTTP or HTTPS URLs.
- Return HTTP 503 when stable release metadata is unavailable or incomplete.
- Hide symbolic links from directory listings by default and reject links that resolve outside the repository.
- Preserve fenced code when a backtick line does not close the fence.
- Lower the active request metric when a client disconnects before the response finishes.

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
