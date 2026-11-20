const staticSitemapRoutes = [
  "/",
  "/about",
  "/install",
  "/upgrade",
  "/blog",
  "/blog/category/installation",
  "/blog/category/upgrades",
  "/blog/category/operations",
  "/blog/category/architecture",
  "/blog/category/troubleshooting",
  "/blog/category/releases",
  "/blog/category/security",
  "/blog/category/kubernetes",
  "/feed.xml",
  "/tos",
  "/policy",
];

function getStaticSitemapRoutes() {
  return staticSitemapRoutes;
}

export default function __moduleApi0() {
  return { getStaticSitemapRoutes };
}
