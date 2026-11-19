#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { assertBlogDocument } from "../src/backend/blog/schema.mjs";

const directory = path.resolve(
  process.argv[2] || process.env.BLOG_DIR || "/mnt/pvc/nodejs-repository/content/blogs",
);
let names;
try {
  names = (await fs.readdir(directory)).filter((name) => name.endsWith(".json")).sort();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("No blog documents directory exists.");
  process.exit(0);
}
const slugs = new Set();
for (const name of names) {
  const file = path.join(directory, name);
  const blog = assertBlogDocument(JSON.parse(await fs.readFile(file, "utf8")), file);
  if (slugs.has(blog.slug)) throw new Error(`${file}: duplicate slug ${blog.slug}`);
  slugs.add(blog.slug);
}
console.log(`validated ${names.length} blog documents`);
