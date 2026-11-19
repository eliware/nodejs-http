import __moduleApi1 from "../response.mjs";
const { sendJson } = __moduleApi1();
import __moduleApifix1 from "../blog/markdown.mjs";
const { renderBlogArticle } = __moduleApifix1();
import __moduleApifix2 from "../metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix2();

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

export default function __moduleApi0() {
  return { handleBlogApi };
}
