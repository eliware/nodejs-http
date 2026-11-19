import __moduleApi1 from "../response/headers.mjs";
const { baseHeaders } = __moduleApi1();
import __moduleApifix1 from "../blog/rss.mjs";
const { renderBlogRss } = __moduleApifix1();

async function handleFeedRequest(response, request, requestPath, config) {
  if (requestPath !== "/feed.xml") return false;
  try {
    const body = renderBlogRss(await config.blogStore.published());
    response.writeHead(200, {
      ...baseHeaders(config, request),
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, must-revalidate",
      "Content-Length": Buffer.byteLength(body),
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(503, {
      ...baseHeaders(config, request),
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end("blog feed unavailable\n");
  }
  return true;
}

export default function __moduleApi0() {
  return { handleFeedRequest };
}
