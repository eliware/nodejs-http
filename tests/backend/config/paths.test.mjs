import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/config/paths.mjs";
const { deriveConfigPaths } = __moduleApi0();

test("derives paths and path-related file settings", () => {
  expect(deriveConfigPaths({ PUBLIC_DIR: "./public-data", STATIC_DIR: "./built-site" })).toEqual({
    publicDir: expect.stringMatching(/[/\\]public-data$/),
    blogDir: expect.stringMatching(/[/\\]public-data[/\\]content[/\\]blogs$/),
    staticDir: expect.stringMatching(/[/\\]built-site$/),
    staticIndexFile: "index.html",
    indexFile: "index.html",
    directoryTemplate: "/srv/repository/directory-listing.html",
    notFoundFile: "",
    methodNotAllowedFile: "",
  });
});

test("uses configured index and error document paths", () => {
  expect(
    deriveConfigPaths({
      STATIC_INDEX_FILE: "home.html",
      INDEX_FILE: "root.html",
      DIRECTORY_TEMPLATE: "./listing.html",
      NOT_FOUND_FILE: "404.html",
      METHOD_NOT_ALLOWED_FILE: "405.html",
    }),
  ).toMatchObject({
    staticIndexFile: "home.html",
    indexFile: "root.html",
    directoryTemplate: "./listing.html",
    notFoundFile: "404.html",
    methodNotAllowedFile: "405.html",
  });
});

test("derives the blog directory from a custom public directory", () => {
  expect(deriveConfigPaths({ PUBLIC_DIR: "./repository" }).blogDir).toMatch(
    /[/\\]repository[/\\]content[/\\]blogs$/,
  );
});
