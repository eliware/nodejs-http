import path from "node:path";
import schemaModule from "./schema.mjs";
const { assertBlogDocument } = schemaModule();

async function validateBlogDocuments({ directory, names, fs }) {
  const slugs = new Set();
  for (const name of names) {
    const file = path.join(directory, name);
    const blog = assertBlogDocument(JSON.parse(await fs.readFile(file, "utf8")), file);
    if (slugs.has(blog.slug)) throw new Error(`${file}: duplicate slug ${blog.slug}`);
    slugs.add(blog.slug);
  }
  return names.length;
}

export default function __moduleApi0() {
  return { validateBlogDocuments };
}
