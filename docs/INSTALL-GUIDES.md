# Install Node.js 26

The current package repository provides signed x86_64 RPMs for CentOS Stream 10 EPEL. The website install page shows the repository setup and install commands that match the published `nodejs26.repo` file.

The RPM installs versioned commands: `node26`, `npm26`, and `npx26`. The `nodejs26` package name identifies the RPM in DNF commands. The versioned command names can coexist with system Node.js packages.

Open `/install` on the website for the current instructions. Confirm the release version and repository metadata before installation. Follow the signing key and repository instructions published by nodejs-packaging.

The website reads install guide JSON from `content/install/centos10/stable/instructions.json` under `PUBLIC_DIR`. Upgrade guidance uses `content/upgrade/centos10/stable/instructions.json`. Rolling guide data can use the matching `rolling` path when the publisher supplies it. The guide API returns HTTP 404 when a requested document is missing or invalid.
