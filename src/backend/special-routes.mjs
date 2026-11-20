import apiRoutesApi from "./special-routes/api.mjs";
const { handleApiRoutes } = apiRoutesApi();
import blogRoutesApi from "./special-routes/blog.mjs";
const { handleBlogRoutes } = blogRoutesApi();
import pageRoutesApi from "./special-routes/pages.mjs";
const { handlePageRoutes } = pageRoutesApi();

async function handleSpecialRequest(request, response, requestPath, config) {
  if (await handleApiRoutes(request, response, requestPath, config)) return true;
  if (await handleBlogRoutes(request, response, requestPath, config)) return true;
  return handlePageRoutes(request, response, requestPath, config);
}

export default function __moduleApi0() {
  return { handleSpecialRequest };
}
