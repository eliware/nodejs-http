# Install Node.js 26

The repository provides signed x86_64 RPMs for CentOS Stream 10 EPEL. The RPM packages the official precompiled Node.js archive.

The package name is `eliware-node26`. It provides the standard `node`, `npm`, and `npx` commands.

The RPM includes npm 12 or later. It keeps global npm packages under `/var/lib/eliware/nodejs26/global`. The RPM adds the global command directory to `PATH` through `/etc/profile.d/eliware-node26.sh`.

Install the repository file and package with these commands:

```sh
sudo curl -fsSLo /etc/yum.repos.d/nodejs26.repo https://nodejs.eliware.org/nodejs26.repo
sudo dnf install -y eliware-node26
node --version
npm --version
```

Run `sudo dnf update eliware-node26` or `sudo yum update eliware-node26` to update Node.js. Use `npm install --global package-name` to install a global package. Use `npm link` to link a local package.

Open `/install` on the website for the current commands. Check the release catalog and signed repository metadata before installation. The package repository publishes the signing key and provenance records.

The website reads install guide JSON from `content/install/centos10/stable/instructions.json` under `PUBLIC_DIR`. Upgrade guidance uses `content/upgrade/centos10/stable/instructions.json`. The guide API returns HTTP 404 when a requested document is missing or invalid.
