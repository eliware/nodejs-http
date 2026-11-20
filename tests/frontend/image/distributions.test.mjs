import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/distributions.mjs";
const { distroFromRepository } = __moduleApi0();
import imageRecordDistributionApi from "../../../src/frontend/image/records/distribution.mjs";
const { mapImageDistribution } = imageRecordDistributionApi();
test.each([
  ["centos10-node26", "centos-stream"],
  ["rocky10-gluster", "rocky"],
  ["alma10-gluster", "alma"],
  ["oracle10-gluster", "oracle"],
  ["debian12-gluster", "debian"],
  ["ubuntu2404-gluster", "ubuntu"],
])("maps %s repository distribution data", (repository, distro) => {
  expect(distroFromRepository(`ghcr.io/eliware/${repository}`)).toBe(distro);
});

test("uses documented fallbacks for unknown repositories and distributions", () => {
  expect(distroFromRepository("ghcr.io/other/unknown")).toBe("centos-stream");
  expect(distroFromRepository("")).toBe("centos-stream");
});

test("maps official repositories to distribution labels and releases", () => {
  expect(mapImageDistribution("ghcr.io/eliware/debian12-gluster")).toEqual({
    distro: "debian",
    distroLabel: "Debian",
    release: "12",
  });
});
