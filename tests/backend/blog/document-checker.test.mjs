import { expect, jest, test } from "@jest/globals";
import path from "node:path";
import documentCheckerApi from "../../../src/backend/blog/document-checker.mjs";
import versionModule from "../../../src/backend/metadata/version.mjs";
const { validateBlogDocuments } = documentCheckerApi();
const { SUPPORTED_METADATA_VERSION } = versionModule();

function blog(slug) {
  return {
    metadata_version: SUPPORTED_METADATA_VERSION,
    schema: 2,
    slug,
    title: "Release notes",
    summary: "A release summary.",
    published_at: "2026-08-18T12:00:00Z",
    updated_at: "2026-08-18T12:00:00Z",
    author: "Eliware",
    tags: ["releases"],
    status: "published",
    content: "# Release notes\n\nDetails.",
    content_format: "markdown",
    created_at: "2026-08-18T11:00:00Z",
    category: "releases",
    last_verified_at: "2026-08-18T12:00:00Z",
    tested_on: ["CentOS Stream 10"],
  };
}

test("validates collected blog documents and counts them", async () => {
  const fs = {
    readFile: jest.fn(async (file) => JSON.stringify(blog(path.basename(file, ".json")))),
  };
  await expect(
    validateBlogDocuments({ directory: "/blogs", names: ["a-post.json", "z-post.json"], fs }),
  ).resolves.toBe(2);
});

test("rejects duplicate slugs and malformed JSON", async () => {
  const duplicateFs = { readFile: jest.fn(async () => JSON.stringify(blog("duplicate"))) };
  await expect(
    validateBlogDocuments({
      directory: "/blogs",
      names: ["first.json", "second.json"],
      fs: duplicateFs,
    }),
  ).rejects.toThrow(`${path.join("/blogs", "second.json")}: duplicate slug duplicate`);
  await expect(
    validateBlogDocuments({
      directory: "/blogs",
      names: ["bad.json"],
      fs: { readFile: async () => "{" },
    }),
  ).rejects.toThrow();
});
