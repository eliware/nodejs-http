import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/distribution-labels.mjs";
const { distroLabel, distroRelease } = __moduleApi0();

test.each([
  ["centos-stream", "CentOS Stream", "10"],
  ["rocky", "Rocky Linux", "10"],
  ["alma", "AlmaLinux", "10"],
  ["oracle", "Oracle Linux", "10"],
  ["debian", "Debian", "12"],
  ["ubuntu", "Ubuntu", "24.04"],
])("formats %s distribution labels", (distro, label, release) => {
  expect(distroLabel(distro)).toBe(label);
  expect(distroRelease(distro)).toBe(release);
});

test("uses fallbacks for unknown distributions", () => {
  expect(distroLabel("unknown")).toBe("unknown");
  expect(distroRelease("unknown")).toBe("unknown");
});
