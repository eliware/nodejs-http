# Use the Node.js site

The site publishes stable Node.js 26 package and image information for CentOS Stream 10 EPEL on x86_64.

## Find a package

Open `/` to view the latest stable Node.js version, validation results, and package records. Type a package name or select RPM and stable filters. Select a result to view its checksum, download link, and install commands.

Open `/browse` to navigate repository directories. Sort entries by name, byte count, or modified time. Filter entries by name. Select a directory to open it, or select a package to view its metadata.

## Install and update Node.js

Open `/install` for the current repository setup commands. The page installs `eliware-node26` and checks the standard `node` and `npm` commands.

Run `dnf update eliware-node26` or `yum update eliware-node26` to install a published update. Use `npm install --global package-name` to add global tools. Use `npm link` to link a local package.

## Inspect container images

Open the Images section on `/`. Check the published CentOS Stream 10 image tag and digest. Select an image example to view Dockerfile, Compose, or Kubernetes syntax.

Use the version tag for convenience. Use the SHA-256 digest when a deployment needs a fixed image.

## Verify release data

Open the verification section on `/` to examine the signing key, signed RPM metadata, checksums, release catalog, and provenance records. Confirm package checksums before installation.

## Read project updates

Open `/blog` to browse posts by title or category. Subscribe to `/feed.xml` for updates. Visit `/about` for project details and community links.
