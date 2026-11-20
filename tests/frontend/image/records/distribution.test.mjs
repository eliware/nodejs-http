import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/frontend/image/records/distribution.mjs";
const { mapImageDistribution } = __moduleApi0();

test("maps a published repository to its distribution metadata", () => {
  expect(mapImageDistribution("ghcr.io/eliware/centos10-node26")).toEqual({
    distro: "centos-stream",
    distroLabel: "CentOS Stream",
    release: "10",
  });
});

test("uses default metadata for an unknown repository", () => {
  expect(mapImageDistribution("ghcr.io/other/unknown")).toEqual({
    distro: "centos-stream",
    distroLabel: "CentOS Stream",
    release: "10",
  });
});
