# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/nodejs-http [![License](https://img.shields.io/github/license/eliware/nodejs-http)](https://github.com/eliware/nodejs-http/blob/main/LICENSE) [![CI](https://github.com/eliware/nodejs-http/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/nodejs-http/actions/workflows/ci.yaml)

Node.js HTTP repository and web frontend.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Routes](#routes)
- [Assets](#assets)
- [Development server](#development-server)
- [Build](#build)
- [Deployment](#deployment)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Browse stable Node.js 26 RPMs for CentOS Stream 10 EPEL on x86_64. Find packages, verify checksums and provenance, compare releases, inspect published images, and read installation guides and project articles.

## Requirements

Use Node.js 26 or later and npm 12 or later. Use Docker Compose for the container workflow.

## Setup

Run `npm ci` from the repository root. See [local usage](docs/usage.md) for runtime data requirements.

## Usage

Follow the [end-user guide](docs/README.md) to run the website, configure repository data, or use its HTTP endpoints. Read [release notes](RELEASE_NOTES.md) for version history.

## Development

Read [AGENTS.md](AGENTS.md) for required development and validation practices. Read [specifications](specs/README.md) before changing project rules.

## Testing

Run `npm test` for full validation. Run focused tests with `npm test -- tests/path/to/example.test.mjs`.

## Troubleshooting

Use the [troubleshooting guide](docs/troubleshooting.md) to find startup, readiness, and content problems.

## Security

Set the repository path as read-only. Keep credentials, private content, and runtime state outside Git.

## Configuration

See the [configuration reference](docs/CONFIGURATION.md) for environment variables and defaults.

## Operations

See [local usage](docs/usage.md) for startup and container commands. See [metadata integration](docs/METADATA-INTEGRATION.md) for readiness requirements.

## Routes

See [HTTP routes](docs/WEB-APPLICATION.md) for pages, repository files, health checks, and API behavior.

## Assets

The image copies website templates and `public/assets/` into its static content directory. See [web application](docs/WEB-APPLICATION.md) for path details.

## Development server

Run `npm start` to start the local server. Set `PUBLIC_DIR` when the repository content is outside `public/`.

## Build

Run `npm run build` to create the browser bundle in `dist/`. The production container builds and serves that bundle with its page templates.

## Deployment

See [container operations](docs/usage.md#container-operations) for local builds. The GHCR package is public at `ghcr.io/eliware/nodejs-http`.

The workflow publishes `vMAJOR.MINOR.PATCH` tags when a Git tag matches `package.json`. The repository maintainers own the application Dockerfile and build inputs. The `nodejs-packaging` repository owns the public CentOS Stream 10 Node.js base image used by the Dockerfile.

The workflow uses the `ubuntu-latest` runner and does not set a platform list. The current build target is `linux/amd64`. The publish job receives `contents: read` and `packages: write` permissions. The validation job only receives `contents: read`.

Publication only adds an image to GHCR. It does not deploy the application. To deploy an image, use an approved version tag and record its SHA-256 digest. Verify and deploy the immutable image reference `ghcr.io/eliware/nodejs-http@sha256:<digest>`.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/nodejs-http)
- [Bug Reports](https://github.com/eliware/nodejs-http/issues)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
