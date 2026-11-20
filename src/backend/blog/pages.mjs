import { readFile } from "node:fs/promises";
import path from "node:path";
import __moduleApi1 from "../response.mjs";
const { sendError } = __moduleApi1();
import __moduleApifix1 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApifix1();
import __moduleApifix2 from "./page/renderer.mjs";
const { renderBlogPage } = __moduleApifix2();
import blogPageResponseApi from "./page/response.mjs";
const { sendBlogPageResponse } = blogPageResponseApi();

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
  const category = categoryMatch ? categoryMatch[1] : "";
  body = renderBlogPage(body, blog, category, servingHostId());
  return sendBlogPageResponse(response, request, file, body, config);
}

export default function __moduleApi0() {
  return { serveBlogPage };
}
