import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/directory/page/metadata.mjs";
const { pageMetadata } = __moduleApi0();

test("returns current page version, host, and copyright metadata", () => {
  const previousVersion = process.env.APP_VERSION;
  process.env.APP_VERSION = "test-version";
  try {
    expect(pageMetadata()).toEqual({
      appVersion: "test-version",
      assetVersion: "test-version",
      copyrightYear: expect.stringMatching(/^2026(?:-\d{4})?$/),
      hostId: expect.any(String),
    });
  } finally {
    if (previousVersion === undefined) delete process.env.APP_VERSION;
    else process.env.APP_VERSION = previousVersion;
  }
});
