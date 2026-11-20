import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/config/paths.mjs";
const { deriveConfigPaths } = __moduleApi0();

test("derives absolute public, blog, and static paths", () => {
  expect(deriveConfigPaths({ PUBLIC_DIR: "./public-data", STATIC_DIR: "./built-site" })).toEqual({
    publicDir: expect.stringMatching(/[/\\]public-data$/),
    blogDir: expect.stringMatching(/[/\\]public-data[/\\]content[/\\]blogs$/),
    staticDir: expect.stringMatching(/[/\\]built-site$/),
  });
});

test("derives the blog directory from a custom public directory", () => {
  expect(deriveConfigPaths({ PUBLIC_DIR: "./repository" }).blogDir).toMatch(
    /[/\\]repository[/\\]content[/\\]blogs$/,
  );
});
