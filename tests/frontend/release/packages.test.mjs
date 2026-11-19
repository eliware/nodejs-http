import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/release/packages.mjs";
const { allPackages, releaseFor } = __moduleApi0();

function packageRecord(name, format, href) {
  return { type: "file", name, href, package: { format } };
}

test("collects package entries and classifies stable and rolling releases", () => {
  expect(allPackages({})).toEqual([]);
  expect(allPackages({ directories: { "/empty/": { path: "/empty/" } } })).toEqual([]);
  const stable = packageRecord("one.rpm", "rpm", "/el10/10.1/one.rpm");
  const rolling = packageRecord("two.deb", "deb", "/previews/rolling-abc/two.deb");
  expect(
    allPackages({
      directories: {
        "/el10/": {
          path: "/el10/",
          entries: [stable, rolling, { type: "directory" }, { type: "file" }],
        },
      },
    }),
  ).toEqual([
    { ...stable, directory: "/el10/" },
    { ...rolling, directory: "/el10/" },
  ]);
  expect(releaseFor(stable)).toEqual({ channel: "stable", version: "10.1" });
  expect(releaseFor(packageRecord("old", "rpm", "/legacy/file.rpm"))).toEqual({
    channel: "stable",
    version: "stable",
  });
  expect(releaseFor(rolling)).toEqual({ channel: "rolling", version: "rolling-abc" });
  expect(releaseFor(packageRecord("preview", "rpm", "/previews/"))).toEqual({
    channel: "rolling",
    version: "rolling",
  });
});
