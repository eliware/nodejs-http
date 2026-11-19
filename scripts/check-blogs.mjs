#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import checkDocumentsModule from "../src/backend/blog/check-documents.mjs";

const directory = path.resolve(
  process.argv[2] || process.env.BLOG_DIR || "/mnt/pvc/nodejs-repository/content/blogs",
);
await checkDocumentsModule().checkBlogDocuments({ directory, fs, log: console.log });
