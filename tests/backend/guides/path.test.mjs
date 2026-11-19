import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/guides/path.mjs";
const {
  GUIDE_ACTIONS,
  GUIDE_OSES,
  GUIDE_CHANNELS,
  guideFilePath,
  isGuideCoordinate,
  guidePlatform,
} = __moduleApi0();

test("builds paths for every supported guide coordinate", () => {
  for (const action of GUIDE_ACTIONS)
    for (const os of GUIDE_OSES)
      for (const channel of GUIDE_CHANNELS) {
        expect(isGuideCoordinate(action, os, channel)).toBe(true);
        expect(guideFilePath("/repo", action, os, channel)).toBe(
          `/repo/content/${action}/${os}/${channel}/instructions.json`,
        );
      }
  expect(guidePlatform("centos10")).toBe("rpm");
  expect(guidePlatform("debian12")).toBe("debian");
  expect(guidePlatform("ubuntu24")).toBe("ubuntu");
  expect(guidePlatform("other")).toBeUndefined();
});

test.each([
  ["delete", "centos10", "stable"],
  ["install", "other", "stable"],
  ["install", "centos10", "preview"],
])("rejects unsupported guide coordinates %s/%s/%s", (action, os, channel) => {
  expect(isGuideCoordinate(action, os, channel)).toBe(false);
  expect(guideFilePath("/repo", action, os, channel)).toBeNull();
});
