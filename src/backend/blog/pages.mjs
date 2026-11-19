import { readFile } from "node:fs/promises";
import path from "node:path";
import __moduleApi1 from "../response.mjs";
const { sendError } = __moduleApi1();
import __moduleApiFileHeaders from "../response/file-headers.mjs";
const { fileHeaders } = __moduleApiFileHeaders();
import __moduleApifix1 from "../response/compression.mjs";
const { compressBody } = __moduleApifix1();
import __moduleApifix2 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApifix2();
import __moduleApifix3 from "./page/renderer.mjs";
const { renderBlogPage } = __moduleApifix3();

async function serveBlogPage(response, request, requestPath, config) {
  const categoryMatch = requestPath.match(/^\/blog\/category\/([^/]+)\/?$/);
  const slug = categoryMatch ? "" : requestPath.replace(/^\/blog\/?/, "");
  const posts = await config.blogStore.published();
  const blog = slug ? posts.find((post) => post.slug === slug) || null : null;
  if (slug && !blog) {
    await sendError(response, 404, "Blog post not found", config);
    return true;
  }
  const file = path.join(config.staticDir, "blog.html");
  let body;
  try {
    body = await readFile(file, "utf8");
  } catch {
    return false;
  }
  const category = categoryMatch ? decodeURIComponent(categoryMatch[1]) : "";
  body = renderBlogPage(body, blog, category, servingHostId());
  const buffer = Buffer.from(body);
  const headers = {
    ...fileHeaders(
      file,
      { size: buffer.length, mtime: new Date(), mtimeMs: Date.now() },
      config,
      request,
    ),
    "Cache-Control": "public, max-age=60, must-revalidate",
  };
  if (request.method === "HEAD") {
    response.writeHead(200, { ...headers, "Content-Length": buffer.length });
    response.end();
    return true;
  }
  const encoded = await compressBody(buffer, request, "text/html; charset=utf-8", config);
  response.writeHead(200, {
    ...headers,
    "Content-Length": encoded.body.length,
    ...encoded.headers,
  });
  response.end(encoded.body);
  return true;
}

export default function __moduleApi0() {
  return { serveBlogPage };
}
