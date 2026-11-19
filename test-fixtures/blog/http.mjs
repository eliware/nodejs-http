import { mkdtemp, mkdir, writeFile, stat, utimes } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Writable } from "node:stream";
import { once } from "node:events";
import __moduleApi0 from "../../src/backend/config.mjs";
const { loadConfig } = __moduleApi0();
import __moduleApifix1 from "../../src/backend/static/file-server.mjs";
const { createStaticRequestListener } = __moduleApifix1();
import __moduleApifix2 from "../../src/backend/metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix2();

export class MockResponse extends Writable {
  constructor() {
    super();
    this.headers = {};
    this.statusCode = null;
    this.body = Buffer.alloc(0);
  }

  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    this.headers = headers;
  }

  _write(chunk, encoding, callback) {
    this.body = Buffer.concat([this.body, Buffer.from(chunk)]);
    callback();
  }
}

export async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), "gluster-blog-test-"));
  const blogs = path.join(root, "blogs");
  await mkdir(blogs);
  await writeFile(
    path.join(blogs, "safe.json"),
    JSON.stringify({
      metadata_version: SUPPORTED_METADATA_VERSION,
      schema: 2,
      slug: "safe-post",
      title: "Safe <title>",
      summary: "A <summary>.",
      published_at: "2026-08-18T12:00:00Z",
      updated_at: "2026-08-18T12:00:00Z",
      author: "Eliware",
      tags: ["testing"],
      status: "published",
      content: "# Hello\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))",
      content_format: "markdown",
      created_at: "2026-08-18T11:00:00Z",
      category: "operations",
      last_verified_at: "2026-08-18T12:00:00Z",
      tested_on: ["Repository content review"],
    }),
  );
  await writeFile(
    path.join(blogs, "draft.json"),
    JSON.stringify({
      metadata_version: SUPPORTED_METADATA_VERSION,
      schema: 2,
      slug: "draft-post",
      title: "Draft",
      summary: "Not public.",
      published_at: "2026-08-19T12:00:00Z",
      updated_at: "2026-08-19T12:00:00Z",
      author: "Eliware",
      tags: ["draft"],
      status: "draft",
      content: "Draft content.",
      content_format: "markdown",
      created_at: "2026-08-19T11:00:00Z",
      category: "releases",
      last_verified_at: "2026-08-19T12:00:00Z",
      tested_on: ["Repository content review"],
    }),
  );
  await writeFile(
    path.join(root, "blog.html"),
    '<title>__BLOG_TITLE__</title><meta name=description content="__BLOG_DESCRIPTION__"><link rel=canonical href="__BLOG_CANONICAL__"><script type=application/ld+json>__BLOG_JSONLD__</script><article data-server-rendered="__BLOG_SERVER_RENDERED__">__BLOG_ARTICLE__</article><footer class="site-footer">Eliware · Node.js packaging <a href="/metadata/catalog.json">Catalog</a> Host <code>__HOST_ID__</code></footer>',
  );
  const config = loadConfig({
    PUBLIC_DIR: root,
    STATIC_DIR: root,
    BLOG_DIR: blogs,
    ACCESS_LOG: "false",
  });
  return { listener: createStaticRequestListener(config), config, root, blogs };
}

export async function request(listener, url) {
  const response = new MockResponse();
  listener({ method: "GET", url, headers: {} }, response);
  await once(response, "finish");
  return response;
}

export async function createBlogDocuments(documents, extras = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "gluster-blog-documents-"));
  await mkdir(root, { recursive: true });
  await Promise.all(
    documents.map((document, index) =>
      writeFile(path.join(root, `${index}.json`), JSON.stringify(document)),
    ),
  );
  await Promise.all(
    Object.entries(extras).map(([name, value]) => writeFile(path.join(root, name), value)),
  );
  return root;
}

export async function createBlogFile(name, content) {
  const root = await mkdtemp(path.join(os.tmpdir(), "gluster-blog-error-"));
  const file = path.join(root, name);
  await writeFile(file, content);
  return file;
}

export async function replaceBlogFileWithoutChangingTimestamp(file, content) {
  const previous = await stat(file);
  await writeFile(file, content);
  await utimes(file, previous.atime, previous.mtime);
}
