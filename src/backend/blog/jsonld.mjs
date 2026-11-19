const SITE_URL = "https://nodejs.eliware.org";

function absoluteBlogImage(value) {
  return value?.startsWith("/")
    ? `${SITE_URL}${value}`
    : value || `${SITE_URL}/assets/eliware-brand.svg`;
}

function renderBlogJsonLd(blog) {
  const value = blog
    ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: blog.title,
        description: blog.summary,
        datePublished: blog.published_at,
        dateModified: blog.updated_at,
        dateCreated: blog.created_at,
        articleSection: blog.category,
        keywords: blog.tags.join(", "),
        image: absoluteBlogImage(blog.hero_image),
        author: { "@type": "Organization", name: blog.author },
        mainEntityOfPage: `${SITE_URL}/blog/${blog.slug}`,
      }
    : {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Eliware Node.js blog",
        description: "News, guides, and release notes from Eliware Node.js.",
        url: `${SITE_URL}/blog`,
      };
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export default function __moduleApi0() {
  return { absoluteBlogImage, renderBlogJsonLd };
}
