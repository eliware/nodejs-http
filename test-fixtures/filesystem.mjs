import { mkdtemp, mkdir, rm, symlink, writeFile, stat, utimes } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import __moduleApi0 from "../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApi0();

export async function createStaticDirectory() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "gluster-http-static-"));
  await writeFile(path.join(dir, "index.html"), "<h1>Hello</h1>");
  await writeFile(path.join(dir, "hello.txt"), "hello world");
  await writeFile(path.join(dir, "movie.mp4"), "0123456789");
  await mkdir(path.join(dir, "folder"));
  await mkdir(path.join(dir, "calc"));
  await writeFile(path.join(dir, "calc", "index.html"), "<h1>Calc</h1>");
  try {
    await symlink("../calc", path.join(dir, "folder", "linked-calc"), "dir");
  } catch (error) {
    if (!new Set(["EPERM", "EACCES"]).has(error.code)) throw error;
    await mkdir(path.join(dir, "folder", "linked-calc"));
  }
  return dir;
}

export async function addOutsideSecret(publicDir) {
  return addOutsideFileLink(publicDir, path.join(publicDir, "secret.txt"), "secret");
}

export async function addOutsideFileLink(publicDir, linkPath, content = "secret") {
  const outside = await mkdtemp(path.join(os.tmpdir(), "gluster-http-outside-"));
  const secret = path.join(outside, "secret.txt");
  await writeFile(secret, content);
  try {
    await symlink(secret, linkPath, "file");
    return true;
  } catch (error) {
    if (!new Set(["EPERM", "EACCES"]).has(error.code)) throw error;
    return false;
  }
}

export async function addBrokenFileLink(publicDir, linkPath) {
  try {
    await symlink(path.join(publicDir, "missing-target"), linkPath, "file");
    return true;
  } catch (error) {
    if (!new Set(["EPERM", "EACCES"]).has(error.code)) throw error;
    return false;
  }
}

export async function publicFileStats(publicDir, name) {
  const filePath = path.join(publicDir, name);
  return { filePath, stats: await stat(filePath) };
}

export async function createRepositoryRoot() {
  const publicDir = await mkdtemp(path.join(os.tmpdir(), "repository-root-"));
  await mkdir(path.join(publicDir, "el10"));
  await mkdir(path.join(publicDir, ".hidden"));
  await writeFile(path.join(publicDir, "glusterfs-el10.repo"), "[glusterfs-stable]\n");
  return publicDir;
}

export async function writeRepositoryIndex(publicDir, directories) {
  const metadataDir = path.join(publicDir, "metadata");
  await mkdir(metadataDir, { recursive: true });
  await writeFile(
    path.join(metadataDir, "repository-index.json"),
    JSON.stringify({ metadata_version: SUPPORTED_METADATA_VERSION, schema: 1, directories }),
  );
}

export async function createGuideFile(root, filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  return root;
}

export async function replaceWithOutsideSymlink(filePath) {
  const outside = await mkdtemp(path.join(os.tmpdir(), "guide-outside-"));
  const target = path.join(outside, "instructions.json");
  await writeFile(target, "{}");
  await rm(filePath);
  await symlink(target, filePath, "file");
}

export async function replaceFileWithoutChangingTimestamp(filePath, content) {
  const previous = await stat(filePath);
  await writeFile(filePath, content);
  await utimes(filePath, previous.atime, previous.mtime);
}

export async function createHealthMetadata(active = true) {
  const publicDir = await mkdtemp(path.join(os.tmpdir(), "health-routes-"));
  const metadataDir = path.join(publicDir, "metadata");
  await mkdir(metadataDir);
  const base = { metadata_version: SUPPORTED_METADATA_VERSION, schema: 1 };
  await writeFile(
    path.join(metadataDir, "catalog.json"),
    JSON.stringify({
      ...base,
      active_generation: "run-1",
      stable: { available: true, latest: { node_version: "26.13.1" } },
    }),
  );
  await writeFile(
    path.join(metadataDir, "repository-index.json"),
    JSON.stringify({ ...base, directories: { "/": { path: "/", entries: [] } } }),
  );
  if (active) {
    await writeFile(
      path.join(metadataDir, "active-generation.json"),
      JSON.stringify({ ...base, generation: "run-1" }),
    );
    await mkdir(path.join(publicDir, ".generations", "run-1"), { recursive: true });
    await writeFile(
      path.join(publicDir, ".generations", "run-1", "generation.json"),
      JSON.stringify({ ...base, generation: "run-1" }),
    );
  }
  return publicDir;
}

export async function setGenerationRecord(publicDir, content) {
  await writeFile(path.join(publicDir, ".generations", "run-1", "generation.json"), content);
}

export async function setCatalogVersion(publicDir, version) {
  await writeFile(
    path.join(publicDir, "metadata", "catalog.json"),
    JSON.stringify({ metadata_version: version }),
  );
}

export async function writeHealthMetadata(publicDir, relativePath, value) {
  await writeFile(path.join(publicDir, relativePath), JSON.stringify(value));
}

export async function createRequestDirectory() {
  const publicDir = await mkdtemp(path.join(os.tmpdir(), "gluster-http-request-"));
  await mkdir(path.join(publicDir, "dir"));
  await writeFile(path.join(publicDir, "index.html"), "home");
  await writeFile(path.join(publicDir, "file.txt"), "abcdefghij");
  return publicDir;
}

export async function createDirectoryListingFixture() {
  const publicDir = await mkdtemp(path.join(os.tmpdir(), "repository-listing-"));
  await mkdir(path.join(publicDir, "folder"));
  await writeFile(path.join(publicDir, "hello.txt"), "hello");
  await writeFile(path.join(publicDir, ".hidden"), "secret");
  await writeFile(path.join(publicDir, "validation.json"), JSON.stringify({ distributions: [] }));
  await writeFile(
    path.join(publicDir, "container-validation.json"),
    JSON.stringify({ distributions: [] }),
  );
  const directoryTemplate = path.join(publicDir, "listing.html");
  await writeFile(
    directoryTemplate,
    "{{TITLE}} {{OG_IMAGE}} {{OG_DESCRIPTION}} {{ROWS}} {{BREADCRUMBS}} {{PATH}} {{VALIDATION}} {{SUMMARY}} __COPYRIGHT_YEAR__ __APP_VERSION__ __HOST_ID__",
  );
  return { publicDir, directoryTemplate };
}

export async function createStaticSite() {
  const root = await mkdtemp(path.join(os.tmpdir(), "http-static-site-"));
  await mkdir(path.join(root, "web"), { recursive: true });
  await mkdir(path.join(root, "assets"), { recursive: true });
  await writeFile(
    path.join(root, "index.html"),
    "home __HOST_ID__ __COPYRIGHT_YEAR__ __APP_VERSION__ __ASSET_VERSION__",
  );
  await writeFile(path.join(root, "browse.html"), "browse");
  await writeFile(path.join(root, "install.html"), "install");
  await writeFile(path.join(root, "about.html"), "about");
  await writeFile(
    path.join(root, "blog.html"),
    "<title>__BLOG_TITLE__</title>__BLOG_JSONLD__ __BLOG_ARTICLE__",
  );
  await writeFile(path.join(root, "web", "app.js"), "const value = 'web asset';");
  await writeFile(path.join(root, "assets", "favicon.ico"), "favicon");
  await writeFile(path.join(root, "assets", "logo.svg"), "<svg></svg>");
  await writeFile(path.join(root, "robots.txt"), "User-agent: *");
  return root;
}

export async function createFixtureFile(content, name = "fixture.txt") {
  const root = await mkdtemp(path.join(os.tmpdir(), "http-fixture-file-"));
  const filePath = path.join(root, name);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  return filePath;
}
