# Install Node.js 26

The package repository provides signed x86_64 RPMs for CentOS Stream 10 EPEL. The website install page shows commands for the published `nodejs26.repo` file.

The RPM package name is `eliware-nodejs26`. The RPM installs `node26`, `npm26`, and `npx26` commands.

The RPM includes npm 12 or later. It keeps npm updates and global packages under `/var/lib/eliware/nodejs26/global`.
The RPM adds the global command directory to `PATH` through `/etc/profile.d/eliware-nodejs26.sh`.

Install the package with `sudo dnf install eliware-nodejs26`. Update installed packages with `sudo yum -y update`.
Run `npm26 -g install npm@latest` to update npm outside RPM-managed files. Run `npm26 link` to link a local package.

Open `/install` on the website for the current instructions. Confirm the release version and repository metadata before installation. Follow the signing key and repository instructions published by nodejs-packaging.

The website reads install guide JSON from `content/install/centos10/stable/instructions.json` under `PUBLIC_DIR`. Upgrade guidance uses `content/upgrade/centos10/stable/instructions.json`. Rolling guide data can use the matching `rolling` path when the publisher supplies it. The guide API returns HTTP 404 when a requested document is missing or invalid.
