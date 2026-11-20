import __moduleApi1 from "../../response.mjs";
const { sendJson } = __moduleApi1();
import __moduleApifix1 from "../../blog/markdown.mjs";
const { renderBlogArticle } = __moduleApifix1();
import __moduleApifix2 from "../../metadata/version.mjs";
const { SUPPORTED_METADATA_VERSION } = __moduleApifix2();
import blogPathApi from "./path.mjs";
const { matchBlogApiPath, isValidBlogSlug } = blogPathApi();

function publicBlog(blog) {
  return { ...blog, html: renderBlogArticle(blog) };
}

async function handleBlogApi(response, requestPath, config) {
  const route = matchBlogApiPath(requestPath);
  if (!route) return false;
  const isArticle = route.type === "article";
  const slug = isArticle ? route.slug : "";
  if (isArticle && !isValidBlogSlug(slug)) {
    sendJson(response, 404, { error: "blog post not found" }, config, "no-store");
    return true;
  }
  try {
    if (isArticle) {
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
