# Packaging metadata integration

The packaging repository owns the release contract and metadata schemas. This HTTP application reads published metadata from the shared repository tree.

Read the contract at [nodejs-packaging](https://github.com/eliware/nodejs-packaging/blob/main/specs/release-contract.md). Keep route responses aligned with its supported Node.js major, target OS, architecture, repository paths, and metadata fields.

Validate `metadata_version` before returning catalog, manifest, provenance, or validation data. Reject missing, legacy, unknown, and newer schema versions. Do not invent defaults for invalid or missing release data.

Return published repository content through read-only routes. Do not build packages, sign artifacts, update catalog data, create generations, or point the active link at a different generation.
