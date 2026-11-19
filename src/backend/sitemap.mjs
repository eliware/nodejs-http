const SITE_URL = "https://nodejs.eliware.org";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderSitemap(posts, repositoryPaths) {
  const urls = [
    "/",
    ...repositoryPaths,
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
    ...posts.map((post) => ({
      url: `/blog/${encodeURIComponent(post.slug)}`,
      lastmod: post.updated_at,
    })),
  ];
  const uniqueUrls = urls.filter((entry, index, all) => {
    const value = typeof entry === "string" ? entry : entry.url;
    return (
      all.findIndex(
        (candidate) => (typeof candidate === "string" ? candidate : candidate.url) === value,
      ) === index
    );
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls
    .map(
      (url) =>
        `  <url><loc>${escapeXml(`${SITE_URL}${typeof url === "string" ? url : url.url}`)}</loc>${typeof url === "string" ? "" : `<lastmod>${escapeXml(url.lastmod)}</lastmod>`}</url>`,
    )
    .join("\n")}\n</urlset>\n`;
}

export default function __moduleApi0() {
  return { renderSitemap };
}
