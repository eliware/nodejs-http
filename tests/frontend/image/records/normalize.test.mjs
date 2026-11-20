import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/frontend/image/records/normalize.mjs";
const { normalizeImageRecord } = __moduleApi0();

test("normalizes image details and derives the default reference", () => {
  expect(normalizeImageRecord({ repository: "ghcr.io/eliware/centos10-node26" })).toMatchObject({
    repository: "ghcr.io/eliware/centos10-node26",
    distro: "centos-stream",
    arch: "x86_64",
    channel: "stable",
    version: "unknown",
    image: { reference: "ghcr.io/eliware/centos10-node26:unknown" },
  });
});

test("preserves an explicit image reference and Node version", () => {
  expect(
    normalizeImageRecord({
      image: {
        repository: "ghcr.io/eliware/centos10-node26",
        reference: "ghcr.io/eliware/centos10-node26:26.13.2",
      },
      node_version: "26.13.2",
    }),
  ).toMatchObject({
    version: "26.13.2",
    image: { reference: "ghcr.io/eliware/centos10-node26:26.13.2" },
  });
});
