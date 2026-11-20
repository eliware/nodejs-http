function matchBlogApiPath(requestPath) {
  const collectionPath = "/api/v1/blogs";
  if (requestPath === collectionPath) return { type: "collection" };
  const prefix = `${collectionPath}/`;
  if (!requestPath.startsWith(prefix)) return null;
  return { type: "article", slug: requestPath.slice(prefix.length) };
}

function isValidBlogSlug(slug) {
  return Boolean(slug) && !slug.includes("/");
}

export default function __moduleApi0() {
  return { matchBlogApiPath, isValidBlogSlug };
}
