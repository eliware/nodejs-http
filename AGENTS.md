# AGENTS.md

## Project

Eliware owns this website and application. See README.md for the project purpose and docs/README.md for end-user documentation.

## Scope and boundaries

Keep package creation, signing, and publication in nodejs-packaging. Keep repository data read-only in this application.

## Layout

Keep launchers in bin/, implementation modules in src/, tests in tests/, fixtures in test-fixtures/, and end-user guides in docs/.

## Development

Give each source and test module one purpose.

## Validation

Use Node.js 26 or later and native ESM for maintained JavaScript modules.
Run npm test for full repository validation.
Run npm run lint for lint checks.
Run npm run audit for dependency checks.
Run npm run format to format files.
Run npm run format:check to check formatting.

## Security

Keep credentials, private data, and runtime state out of Git.

## Changes

Update focused tests and end-user documentation when behavior changes.

## Application

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## Web

Keep route, asset, build, and deployment guidance aligned with maintained code and workflows.

## GHCR publication

Image: ghcr.io/eliware/nodejs-http

Pull command: docker pull ghcr.io/eliware/nodejs-http:v15.2.1

Supported tags: vMAJOR.MINOR.PATCH

Deployment boundary: Publication does not deploy. Use an immutable version tag and record its SHA-256 digest.
