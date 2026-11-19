import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/selection.mjs";
const { selectImageRecords } = __moduleApi0();

const records = [
  { distro: "centos-stream", channel: "stable", version: "26.13.1" },
  { distro: "centos-stream", channel: "stable", version: "26.13.0" },
  { distro: "centos-stream", channel: "preview", candidate: "rolling-abc123" },
  { distro: "ubuntu", channel: "stable", version: "26.13.1" },
];
const catalog = { stable: { version: "26.13.1" } };

test("selects stable versions and preview candidates for one distribution", () => {
  expect(selectImageRecords(records, catalog, "centos-stream", "stable", "stable")).toEqual([
    records[0],
  ]);
  expect(selectImageRecords(records, catalog, "centos-stream", "stable", "26.13.0")).toEqual([
    records[1],
  ]);
  expect(
    selectImageRecords(records, catalog, "centos-stream", "preview", "rolling-abc123"),
  ).toEqual([records[2]]);
  expect(selectImageRecords(records, catalog, "unmatched", "stable", "stable")).toEqual([]);
});
