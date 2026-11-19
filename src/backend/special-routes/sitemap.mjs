import __moduleApi1 from "../response/headers.mjs";
const { baseHeaders } = __moduleApi1();
import __moduleApifix1 from "../sitemap.mjs";
const { renderSitemap } = __moduleApifix1();
import __moduleApifix2 from "../repository-directory.mjs";
const { repositoryDirectories } = __moduleApifix2();

async function handleSitemapRequest(response, request, requestPath, config) {
  if (requestPath !== "/sitemap.xml") return false;
  try {
    const body = renderSitemap(
      await config.blogStore.published(),
      await repositoryDirectories(config),
    );
    response.writeHead(200, {
      ...baseHeaders(config, request),
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, must-revalidate",
      "Content-Length": Buffer.byteLength(body),
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(503, {
      ...baseHeaders(config, request),
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end("sitemap unavailable\n");
  }
  return true;
}

export default function __moduleApi0() {
  return { handleSitemapRequest };
}
