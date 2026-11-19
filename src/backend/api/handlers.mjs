import __moduleApi1 from "../repository-directory.mjs";
const { repositoryDirectory } = __moduleApi1();
import __moduleApifix1 from "../response.mjs";
const { sendJson } = __moduleApifix1();
import __moduleApifix2 from "../blog/markdown.mjs";
const { renderBlogArticle } = __moduleApifix2();
import __moduleApifix3 from "../metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix3();
import __moduleApifix4 from "../guide-store.mjs";
const { readGuide, GUIDE_ACTIONS, GUIDE_OSES, GUIDE_CHANNELS } = __moduleApifix4();

async function handleGuideApi(response, requestPath, config) {
  const match = requestPath.match(/^\/api\/guides\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (!match) return false;
  const [, action, os, channel] = match;
  if (
    !GUIDE_ACTIONS.includes(action) ||
    !GUIDE_OSES.includes(os) ||
    !GUIDE_CHANNELS.includes(channel)
  ) {
    sendJson(response, 404, { error: "guide not found" }, config, "no-store");
    return true;
  }
  try {
    const guide = await readGuide(config.publicDir, action, os, channel);
    sendJson(response, 200, { schemaVersion: 1, action, os, channel, guide }, config, "no-store");
  } catch {
    sendJson(response, 404, { error: "guide not found" }, config, "no-store");
  }
  return true;
}

function publicBlog(blog) {
  return { ...blog, html: renderBlogArticle(blog) };
}

async function handleBlogApi(response, requestPath, config) {
  const collectionPath = "/api/v1/blogs";
  const prefix = `${collectionPath}/`;
  const isCollection = requestPath === collectionPath;
  const isArticle = requestPath.startsWith(prefix);
  if (!isCollection && !isArticle) return false;
  try {
    if (isArticle) {
      const slug = requestPath.slice(prefix.length);
      if (!slug || slug.includes("/")) throw new Error("invalid blog slug");
      const blog = await config.blogStore.bySlug(slug);
      if (!blog) {
        sendJson(response, 404, { error: "blog post not found" }, config, "no-store");
        return true;
      }
      sendJson(response, 200, publicBlog(blog), config, "public, max-age=60, must-revalidate");
      return true;
    }
    const posts = await config.blogStore.published();
    sendJson(
      response,
      200,
      {
        metadata_version: SUPPORTED_METADATA_VERSION,
        schema: 1,
        posts: posts.map(publicBlog),
        total: posts.length,
      },
      config,
      "public, max-age=60, must-revalidate",
    );
  } catch {
    sendJson(response, 503, { error: "blog metadata unavailable" }, config, "no-store");
  }
  return true;
}

async function handleDirectoryApi(request, response, requestPath, config) {
  if (requestPath !== "/api/v1/list") return false;
  const query = new URL(request.url || "/", "http://localhost").searchParams;
  const requestedPath = query.get("path") || "/";
  let listing;
  try {
    const normalizedPath = requestedPath.startsWith("/") ? requestedPath : `/${requestedPath}`;
    listing = await repositoryDirectory(config, normalizedPath, {
      query: query.get("q") || "",
      sort: query.get("sort") || "name",
      order: query.get("order") || "asc",
      offset: query.get("offset") || "0",
      limit: query.get("limit") || "500",
    });
  } catch {
    listing = null;
  }
  if (!listing) sendJson(response, 404, { error: "directory not found" }, config, "no-store");
  else sendJson(response, 200, listing, config);
  return true;
}

export default function __moduleApi0() {
  return { handleGuideApi, handleBlogApi, handleDirectoryApi };
}
