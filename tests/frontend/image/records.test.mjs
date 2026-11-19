import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/records.mjs";
const { imageRecords } = __moduleApi0();

test("maps known registries and uses a default distribution", () => {
  expect(imageRecords({})).toEqual([]);
});

test("uses defaults for incomplete stable records and ignores nonstable records", () => {
  expect(
    imageRecords({
      images: [
        { repository: "ghcr.io/eliware/centos10-node26" },
        {
          image: {
            repository: "ghcr.io/eliware/centos10-node26",
            reference: "ghcr.io/eliware/centos10-node26:26.13.2",
          },
          node_version: "26.13.2",
        },
        { repository: "ghcr.io/eliware/centos10-node26", channel: "preview" },
      ],
    }),
  ).toMatchObject([
    {
      version: "unknown",
      image: { reference: "ghcr.io/eliware/centos10-node26:unknown" },
    },
    {
      version: "26.13.2",
      image: { reference: "ghcr.io/eliware/centos10-node26:26.13.2" },
    },
  ]);
});

test("normalizes stable CentOS Node.js image records", () => {
  const records = imageRecords({
    images: [
      {
        repository: "ghcr.io/eliware/centos10-node26",
        tag: "26.13.1",
        digest: "sha256:abc",
        node_version: "26.13.1",
        generated: "2026-11-19T00:00:00Z",
      },
      {
        image: { repository: "ghcr.io/eliware/centos10-node26", tag: "26.13.0" },
        version: "26.13.0",
      },
      { repository: "ghcr.io/eliware/centos10-node26", channel: "preview", version: "27.0.0" },
      { repository: "ghcr.io/eliware/rocky10-gluster", version: "10.1" },
    ],
  });
  expect(records).toHaveLength(2);
  expect(records[0]).toMatchObject({
    distro: "centos-stream",
    distroLabel: "CentOS Stream",
    release: "10",
    channel: "stable",
    version: "26.13.1",
    image: {
      reference: "ghcr.io/eliware/centos10-node26:26.13.1",
      digest: "sha256:abc",
    },
  });
  expect(records[1]).toMatchObject({
    distro: "centos-stream",
    version: "26.13.0",
    image: { reference: "ghcr.io/eliware/centos10-node26:26.13.0" },
  });
});
