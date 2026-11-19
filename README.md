# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/nodejs-http [![License](https://img.shields.io/github/license/eliware/nodejs-http)](https://github.com/eliware/nodejs-http/blob/main/LICENSE) [![CI](https://github.com/eliware/nodejs-http/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/nodejs-http/actions/workflows/ci.yaml)

Read-only Node.js RPM repository and web frontend.

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

Read published Node.js 26 RPMs and metadata from nodejs-repository. The site targets CentOS Stream 10 EPEL on x86_64.

## Requirements

Use Node.js 26 or later and npm 12 or later.

## Setup

Run `npm ci` from the repository root.

## Usage

Read this README and the [user guide](docs/README.md). Read [release notes](RELEASE_NOTES.md) for version history.

## Development

Read [AGENTS.md](AGENTS.md) and the [specifications index](specs/README.md) before changing files.

## Testing

Run `npm test` for repository validation. Pass test file paths to run focused tests.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md) for repository directory, metadata, and readiness problems.

## Security

Keep credentials, private data, and runtime state out of Git. Keep the repository directory read-only.

## Configuration

Set `PUBLIC_DIR` to the repository tree. Set `STATIC_DIR` to the website files. See [configuration](docs/CONFIGURATION.md) for every option and default.

## Operations

Run `npm start` to start the server on port 7001. Run `docker compose up --build -d` to build and start the local container.

## Routes

| Method | Path                  | Result                                 |
| ------ | --------------------- | -------------------------------------- |
| GET    | `/`                   | Returns the Node.js package page.      |
| GET    | `/health`, `/healthz` | Returns process health.                |
| GET    | `/ready`, `/readyz`   | Checks repository metadata readiness.  |
| GET    | `/metrics`            | Returns Prometheus metrics.            |
| GET    | `/api/v1/catalog`     | Returns the validated release catalog. |
| GET    | `/api/v1/list`        | Lists a repository directory.          |
| GET    | `/metadata/*`         | Reads published metadata files.        |
| GET    | `/el10/x86_64/*`      | Reads published RPM repository files.  |

The server accepts configured read methods and returns HTTP 405 for other methods.

## Assets

Keep website templates in `templates/` and public brand assets in `public/assets/`. The production image copies these files into `/opt/nodejs-http/site`.

## Development server

Set `PUBLIC_DIR` to a repository tree with seed metadata. Run `npm start` to listen on `0.0.0.0:7001`.

## Build

Run `npm run build` to create the browser bundle in `dist/`. The production image uses server-rendered pages and does not include that bundle.

## Deployment

The container uses `node:26-bookworm-slim`. Attach nodejs-repository at `/srv/repository` as read-only. The GHCR workflow publishes only on version tags that match `package.json`.

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
