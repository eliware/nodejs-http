# AGENTS.md

## Project

Eliware owns the Node.js HTTP repository and web frontend. See README.md for the project summary and docs/README.md for end-user guidance.

## Scope and boundaries

Keep RPM builds, signing, and publication in nodejs-packaging. Keep published repository data read-only in this application.

## Layout

Keep launchers in bin/, implementation in src/, tests in tests/, fixtures in test-fixtures/, and end-user guides in docs/.

## Development

Use Node.js 26 or later and native ESM. Give each source and test module one purpose. Read specs/README.md before changing repository rules.

## Validation

Run focused tests first during development. Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development. Run `npm test` before a commit, milestone, or release.
Run `npm run lint`, `npm run audit`, `npm run format`, and `npm run format:check` when those checks apply.

## Security

Keep credentials, private data, and runtime state out of Git. Keep the mounted repository read-only.

## Changes

Update focused tests and end-user guides when behavior changes.

## Application

Run focused tests first during development. Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development. Run the full `npm test` suite for final validation before a commit, milestone, or release.

Document workflows, startup, configuration, and shutdown behavior. Keep environment variable names, defaults, and requirements aligned with code.

## Web

Keep route, asset, build, and deployment guidance aligned with maintained code and workflows.

## GHCR publication

Image: ghcr.io/eliware/nodejs-http

Pull command: docker pull ghcr.io/eliware/nodejs-http:v15.2.1

Supported tags: vMAJOR.MINOR.PATCH

Deployment boundary: Publication does not deploy. Use an immutable version tag and record its SHA-256 digest.
