import { expect, jest, test } from "@jest/globals";

const readFileSync = jest.fn(() => JSON.stringify({ version: "1.2.3" }));
jest.unstable_mockModule("node:fs", () => ({ readFileSync }));

test("reads a valid package version and rejects an empty version", async () => {
  const valid = await import("../../src/backend/app-version.mjs");
  expect(valid.APP_VERSION).toBe("1.2.3");
  expect(readFileSync).toHaveBeenCalledTimes(1);

  jest.resetModules();
  readFileSync.mockReturnValueOnce(JSON.stringify({ version: "   " }));
  await expect(import("../../src/backend/app-version.mjs")).rejects.toThrow(
    "package.json is missing a valid version",
  );
});
