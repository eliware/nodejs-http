import { expect, jest, test } from "@jest/globals";
import path from "node:path";
import checkDocumentsModule from "../../../src/backend/blog/check-documents.mjs";
import versionModule from "../../../src/backend/metadata/version.mjs";

const { checkBlogDocuments } = checkDocumentsModule();
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

test("validates sorted JSON documents and ignores other files", async () => {
  const fs = {
    readdir: jest.fn(async () => ["z-post.json", "readme.md", "a-post.json"]),
    readFile: jest.fn(async (file) =>
      JSON.stringify(blog(file.includes("a-post") ? "a-post" : "z-post")),
    ),
  };
  const log = jest.fn();
  await expect(checkBlogDocuments({ directory: "/blogs", fs, log })).resolves.toBe(2);
  expect(fs.readFile.mock.calls.map(([file]) => file)).toEqual([
    path.join("/blogs", "a-post.json"),
    path.join("/blogs", "z-post.json"),
  ]);
  expect(log).toHaveBeenCalledWith("validated 2 blog documents");
});

test("reports a missing blog directory without failing", async () => {
  const fs = {
    readdir: jest.fn(async () => {
      throw Object.assign(new Error(), { code: "ENOENT" });
    }),
  };
  const log = jest.fn();
  await expect(checkBlogDocuments({ directory: "/missing", fs, log })).resolves.toBe(0);
  expect(log).toHaveBeenCalledWith("No blog documents directory exists.");
});

test("rethrows other directory errors", async () => {
  const error = Object.assign(new Error("permission denied"), { code: "EACCES" });
  const fs = {
    readdir: jest.fn(async () => {
      throw error;
    }),
  };
  await expect(checkBlogDocuments({ directory: "/blogs", fs, log: jest.fn() })).rejects.toBe(error);
});
