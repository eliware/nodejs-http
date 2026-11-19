import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import __moduleApi1 from "./schema.mjs";
const { assertBlogDocument } = __moduleApi1();

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    error.message = `${label}: ${error.message}`;
    throw error;
  }
}

async function readBlogFiles(blogDir, cachedFiles = new Map()) {
  let names;
  try {
    names = await readdir(blogDir);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return Promise.all(
    names
      .filter((item) => item.endsWith(".json"))
      .sort()
      .map(async (name) => {
        const file = path.join(blogDir, name);
        const details = await stat(file);
        const signature = `${details.size}:${details.mtimeMs}:${details.ctimeMs}:${details.ino}`;
        const cached = cachedFiles.get(name);
        const content =
          cached?.signature === signature ? cached.content : await readFile(file, "utf8");
        return { name, content, signature };
      }),
  );
}

async function readBlogs(blogDir, files) {
  const sources = files || (await readBlogFiles(blogDir));
  const documents = [];
  for (const { name, content } of sources) {
    const file = path.join(blogDir, name);
    documents.push(assertBlogDocument(parseJson(content, file), file));
  }
  const slugs = new Set();
  for (const document of documents) {
    if (slugs.has(document.slug)) throw new Error(`duplicate blog slug: ${document.slug}`);
    slugs.add(document.slug);
  }
  return documents.sort(
    (left, right) =>
      Date.parse(right.published_at) - Date.parse(left.published_at) ||
      left.slug.localeCompare(right.slug),
  );
}

async function loadBlogs(blogDir) {
  return readBlogs(blogDir);
}

function createBlogStore(blogDir) {
  let cached = [];
  let cachedSignature = "";
  let cachedFiles = new Map();
  return {
    async all() {
      const files = await readBlogFiles(blogDir, cachedFiles);
      const signature = files
        .map(({ name, signature: fileSignature }) => `${name}:${fileSignature}`)
        .join("|");
      if (signature !== cachedSignature) {
        cached = await readBlogs(blogDir, files);
        cachedSignature = signature;
      }
      cachedFiles = new Map(
        files.map(({ name, content, signature: fileSignature }) => [
          name,
          { content, signature: fileSignature },
        ]),
      );
      return cached;
    },
    async published() {
      return (await this.all()).filter((blog) => blog.status === "published");
    },
    async bySlug(slug) {
      return (await this.published()).find((blog) => blog.slug === slug) || null;
    },
  };
}

export default function __moduleApi0() {
  return { loadBlogs, createBlogStore };
}
