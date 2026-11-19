import path from "node:path";
import schemaModule from "./schema.mjs";

const { assertBlogDocument } = schemaModule();

async function checkBlogDocuments({ directory, fs, log }) {
  let names;
  try {
    names = (await fs.readdir(directory)).filter((name) => name.endsWith(".json")).sort();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    log("No blog documents directory exists.");
    return 0;
  }

  const slugs = new Set();
  for (const name of names) {
    const file = path.join(directory, name);
    const blog = assertBlogDocument(JSON.parse(await fs.readFile(file, "utf8")), file);
    if (slugs.has(blog.slug)) throw new Error(`${file}: duplicate slug ${blog.slug}`);
    slugs.add(blog.slug);
  }
  log(`validated ${names.length} blog documents`);
  return names.length;
}

export default function checkDocumentsModule() {
  return { checkBlogDocuments };
}
