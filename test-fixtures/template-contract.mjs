import { readFile } from "node:fs/promises";

export async function readTemplateContractPages() {
  return Promise.all(
    [
      "index.html",
      "browse.html",
      "directory-listing.html",
      "policy.html",
      "tos.html",
      "install.html",
    ].map((name) => readFile(new URL(`../templates/${name}`, import.meta.url), "utf8")),
  );
}
