import __moduleApifix3 from "./feed.mjs";
const { handleFeedRequest } = __moduleApifix3();
import __moduleApifix4 from "./sitemap.mjs";
const { handleSitemapRequest } = __moduleApifix4();
import __moduleApifixHeaders from "../response/headers.mjs";
const { baseHeaders } = __moduleApifixHeaders();
import __moduleApifix6 from "../blog/pages.mjs";
const { serveBlogPage } = __moduleApifix6();

async function handleBlogRoutes(request, response, requestPath, config) {
  if (await handleFeedRequest(response, request, requestPath, config)) return true;
  if (await handleSitemapRequest(response, request, requestPath, config)) return true;
  if (requestPath === "/blog" || requestPath === "/blog/" || requestPath.startsWith("/blog/"))
    return serveBlogPage(response, request, requestPath, config);
  if (requestPath === "/blogs" || requestPath === "/blogs/") {
    response.writeHead(301, { ...baseHeaders(config, request), Location: "/blog" });
    response.end();
    return true;
  }
  return false;
}

export default function __moduleApi0() {
  return { handleBlogRoutes };
}
