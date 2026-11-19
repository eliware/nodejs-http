import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/release/packages.mjs";
const { allPackages, releaseFor } = __moduleApi0();

function packageRecord(name, format, href) {
  return { type: "file", name, href, package: { format } };
}

test("collects stable RPM entries and reads their Node.js versions", () => {
  expect(allPackages({})).toEqual([]);
  expect(allPackages({ directories: { "/empty/": { path: "/empty/" } } })).toEqual([]);
  const stable = packageRecord(
    "eliware-node26-26.13.1-1.npm12.2.3.el10.x86_64.rpm",
    "rpm",
    "/el10/one.rpm",
  );
  const other = packageRecord("two.deb", "deb", "/debian/two.deb");
  expect(
    allPackages({
      directories: {
        "/el10/": {
          path: "/el10/",
          entries: [stable, other, { type: "directory" }, { type: "file" }],
        },
      },
    }),
  ).toEqual([{ ...stable, package: { format: "rpm" }, directory: "/el10/" }]);
  expect(releaseFor(stable)).toEqual({ channel: "stable", version: "26.13.1" });
  expect(releaseFor(packageRecord("old", "rpm", "/legacy/file.rpm"))).toEqual({
    channel: "stable",
    version: "stable",
  });
});
