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

Browse stable Node.js 26 RPMs for CentOS Stream 10 EPEL on x86_64. Read package metadata and signed release records. Inspect the published runtime image and read installation guides.

## Requirements

Use Node.js 26 or later and npm 12 or later. Use Docker Compose to run the container locally.

## Setup

Run `npm ci` from the repository root. See [local usage](docs/usage.md) for repository data requirements.

## Usage

Follow the [end-user documentation index](docs/README.md) to run the site or use its pages and HTTP endpoints. Read [release notes](RELEASE_NOTES.md) for version history.

## Development

Read [AGENTS.md](AGENTS.md) for development requirements. Read [specifications](specs/README.md) before changing repository rules.

## Testing

Run `npm test` for full validation. Run focused tests with `npm test -- tests/path/to/example.test.mjs`.

## Troubleshooting

Use the [troubleshooting guide](docs/troubleshooting.md) to resolve startup, readiness, and content problems.

## Security

Attach published repository data as read-only. Keep credentials, private content, and runtime state outside Git.

## Configuration

See the [configuration reference](docs/CONFIGURATION.md) for environment variables, defaults, and runtime behavior.

## Operations

See [local usage](docs/usage.md) for startup and container commands. See [metadata integration](docs/METADATA-INTEGRATION.md) for readiness requirements.

## Routes

See [HTTP routes](docs/WEB-APPLICATION.md) for pages, repository files, health checks, and API behavior.

## Assets

The image copies `public/assets/` into its static content directory. See the [web application guide](docs/WEB-APPLICATION.md) for asset and route details.

## Development server

Assemble the static site as described in [local usage](docs/usage.md), then run `npm start` to listen on `0.0.0.0:7100`.

## Build

Run `npm run build` to create browser assets in `dist/`. The container builds and serves those assets with the page templates.

## Deployment

The public image is `ghcr.io/eliware/nodejs-http`. The workflow publishes a version tag that matches `package.json`. Publication does not deploy the application. See [container operations](docs/usage.md#container-operations) for local builds.

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
