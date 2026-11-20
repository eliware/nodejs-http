import documentCheckerApi from "./document-checker.mjs";
const { validateBlogDocuments } = documentCheckerApi();

async function checkBlogDocuments({ directory, fs, log }) {
  let names;
  try {
    names = (await fs.readdir(directory)).filter((name) => name.endsWith(".json")).sort();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    log("No blog documents directory exists.");
    return 0;
  }

  const count = await validateBlogDocuments({ directory, names, fs });
  log(`validated ${count} blog documents`);
  return count;
}

export default function checkDocumentsModule() {
  return { checkBlogDocuments };
}
