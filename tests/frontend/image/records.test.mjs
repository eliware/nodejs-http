import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/records.mjs";
const { displaySource, imageRecords } = __moduleApi0();

test("maps known registries and uses a default distribution", () => {
  expect(imageRecords({})).toEqual([]);
});

test("normalizes release records from all distribution fields", () => {
  const records = imageRecords({
    images: [
      {
        image: { repository: "ghcr.io/eliware/rocky10-gluster" },
        version: "10.1",
        source: { ref: "stable" },
      },
      { distribution: "ubuntu", channel: "preview", candidate: "rolling-abc1234", image: {} },
      { distro: "debian", channel: "stable", image: { distribution: "oracle" } },
      {
        image: { repository: "ghcr.io/eliware/alma10-gluster", distribution: "alma" },
        channel: "rolling",
        version: "rolling-2",
      },
      { image: {}, version: null },
      { image: {}, source: { ref: "devel" } },
      { distribution: "mars", channel: "preview", image: {}, candidate: "" },
    ],
  });
  expect(records.map((item) => item.distro)).toEqual([
    "rocky",
    "ubuntu",
    "debian",
    "alma",
    "centos-stream",
    "centos-stream",
    "mars",
  ]);
  expect(records[0]).toMatchObject({
    distroLabel: "Rocky Linux",
    release: "10",
    channel: "stable",
    version: "10.1",
  });
  expect(records[1]).toMatchObject({ release: "24.04", version: "rolling-abc1234" });
  expect(records[3].version).toBe("rolling-2");
  expect(records[4].release).toBe("10");
  expect(records[5]).toMatchObject({ channel: "rolling", version: "unknown" });
  expect(records[6]).toMatchObject({ release: "unknown", version: "unknown" });
});

test("formats source labels for preview and stable images", () => {
  expect(
    displaySource({
      channel: "rolling",
      candidate: "2026-01-01-abcdef1234",
      built: "2026-01-01T00:00:00Z",
    }),
  ).toContain("abcdef1234");
  expect(displaySource({ channel: "stable", version: "10.1", source: { ref: "release" } })).toBe(
    "release",
  );
  expect(displaySource({ channel: "stable", version: "10.1" })).toBe("Node.js 10.1");
});
