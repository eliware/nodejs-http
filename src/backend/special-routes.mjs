import __moduleApi1 from "./api/handlers.mjs";
const { handleBlogApi, handleDirectoryApi, handleGuideApi } = __moduleApi1();
import __moduleApifix1 from "./health-routes.mjs";
const { handleCatalogRoute, handleHealthRoute } = __moduleApifix1();
import __moduleApifix2 from "./static/assets.mjs";
const { serveStaticFile } = __moduleApifix2();
import __moduleApifix3 from "./blog/rss.mjs";
const { renderBlogRss } = __moduleApifix3();
import __moduleApifix4 from "./sitemap.mjs";
const { renderSitemap } = __moduleApifix4();
import __moduleApifix5 from "./response.mjs";
const { baseHeaders } = __moduleApifix5();
import __moduleApifix6 from "./blog/pages.mjs";
const { serveBlogPage } = __moduleApifix6();
import __moduleApifix7 from "./repository-directory.mjs";
const { repositoryDirectories } = __moduleApifix7();

async function handleSpecialRequest(request, response, requestPath, config) {
  if (await handleHealthRoute(request, response, requestPath, config)) return true;
  if (await handleCatalogRoute(response, requestPath, config)) return true;
  if (await handleDirectoryApi(request, response, requestPath, config)) return true;
  if (await handleGuideApi(response, requestPath, config)) return true;
  if (await handleBlogApi(response, requestPath, config)) return true;
  if (requestPath === "/feed.xml") {
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
  if (requestPath === "/sitemap.xml") {
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
  if (requestPath === "/blog" || requestPath === "/blog/" || requestPath.startsWith("/blog/"))
    return serveBlogPage(response, request, requestPath, config);
  if (requestPath === "/blogs" || requestPath === "/blogs/") {
    response.writeHead(301, { ...baseHeaders(config, request), Location: "/blog" });
    response.end();
    return true;
  }
  if (
    requestPath === "/" ||
    requestPath === "/browse" ||
    requestPath === "/browse/" ||
    requestPath === "/favicon.ico" ||
    requestPath.startsWith("/web/") ||
    requestPath.startsWith("/assets/") ||
    requestPath === "/robots.txt"
  ) {
    return serveStaticFile(
      response,
      request,
      requestPath === "/browse" || requestPath === "/browse/"
        ? "/browse.html"
        : requestPath === "/favicon.ico"
          ? "/assets/favicon.ico"
          : requestPath === "/"
            ? `/${config.staticIndexFile || "index.html"}`
            : requestPath,
      config,
    );
  }
  if (
    /^\/(install|upgrade)(?:\/(centos10|alma10|rocky10|oracle10|debian12|ubuntu24)(?:\/(stable|rolling))?)?\/?$/.test(
      requestPath,
    )
  )
    return serveStaticFile(response, request, "/install.html", config);
  const informationPages = new Map([
    ["/about", "/about.html"],
    ["/about/", "/about.html"],
    ["/tos", "/tos.html"],
    ["/tos/", "/tos.html"],
    ["/terms", "/tos.html"],
    ["/terms/", "/tos.html"],
    ["/policy", "/policy.html"],
    ["/policy/", "/policy.html"],
  ]);
  if (informationPages.has(requestPath))
    return serveStaticFile(response, request, informationPages.get(requestPath), config);
  return false;
}

export default function __moduleApi0() {
  return { handleSpecialRequest };
}
