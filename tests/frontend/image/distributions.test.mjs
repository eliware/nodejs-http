import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/distributions.mjs";
const { distroFromRepository, distroLabel, distroRelease } = __moduleApi0();

test.each([
  ["centos10-node26", "centos-stream", "CentOS Stream", "10"],
  ["rocky10-gluster", "rocky", "Rocky Linux", "10"],
  ["alma10-gluster", "alma", "AlmaLinux", "10"],
  ["oracle10-gluster", "oracle", "Oracle Linux", "10"],
  ["debian12-gluster", "debian", "Debian", "12"],
  ["ubuntu2404-gluster", "ubuntu", "Ubuntu", "24.04"],
])("maps %s repository distribution data", (repository, distro, label, release) => {
  expect(distroFromRepository(`ghcr.io/eliware/${repository}`)).toBe(distro);
  expect(distroLabel(distro)).toBe(label);
  expect(distroRelease(distro)).toBe(release);
});

test("uses documented fallbacks for unknown repositories and distributions", () => {
  expect(distroFromRepository("ghcr.io/other/unknown")).toBe("centos-stream");
  expect(distroFromRepository("")).toBe("centos-stream");
  expect(distroLabel("unknown")).toBe("unknown");
  expect(distroRelease("unknown")).toBe("unknown");
});
