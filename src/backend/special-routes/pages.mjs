import __moduleApifix2 from "../static/assets.mjs";
const { serveStaticFile } = __moduleApifix2();

async function handlePageRoutes(request, response, requestPath, config) {
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
  return { handlePageRoutes };
}
