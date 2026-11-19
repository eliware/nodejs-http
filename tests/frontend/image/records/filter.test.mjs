import { expect, test } from "@jest/globals";
import imageRecordFilterApi from "../../../../src/frontend/image/records/filter.mjs";

const { filterImageRecords } = imageRecordFilterApi();

test("keeps stable images for the published CentOS Node.js repository", () => {
  const stable = { repository: "ghcr.io/eliware/centos10-node26" };
  const nestedStable = {
    image: { repository: "ghcr.io/eliware/centos10-node26" },
    channel: "stable",
  };
  expect(
    filterImageRecords({
      images: [
        stable,
        nestedStable,
        { ...stable, channel: "preview" },
        { repository: "ghcr.io/eliware/other" },
      ],
    }),
  ).toEqual([stable, nestedStable]);
});

test("returns an empty list when the catalog has no image records", () => {
  expect(filterImageRecords({})).toEqual([]);
});
