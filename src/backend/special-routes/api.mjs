import __moduleApi1 from "../api/handlers.mjs";
const { handleDirectoryApi } = __moduleApi1();
import __moduleApiBlog from "../api/blog/handler.mjs";
const { handleBlogApi } = __moduleApiBlog();
import __moduleApiGuide from "../api/guide-handler.mjs";
const { handleGuideApi } = __moduleApiGuide();
import __moduleApifix1 from "../health-routes.mjs";
const { handleHealthRoute } = __moduleApifix1();
import __moduleApifixCatalog from "../metadata/catalog-route.mjs";
const { handleCatalogRoute } = __moduleApifixCatalog();

async function handleApiRoutes(request, response, requestPath, config) {
  if (await handleHealthRoute(request, response, requestPath, config)) return true;
  if (await handleCatalogRoute(response, requestPath, config)) return true;
  if (await handleDirectoryApi(request, response, requestPath, config)) return true;
  if (await handleGuideApi(response, requestPath, config)) return true;
  if (await handleBlogApi(response, requestPath, config)) return true;
  return false;
}

export default function __moduleApi0() {
  return { handleApiRoutes };
}
