const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BLOG_STATUSES = ["draft", "published"];

function isLocalAssetPath(value) {
  if (typeof value !== "string" || !value.startsWith("/assets/") || value.includes("\\"))
    return false;
  const assetUrl = new URL(value, "https://assets.invalid");
  return assetUrl.origin === "https://assets.invalid" && assetUrl.pathname.startsWith("/assets/");
}

function validateEditorialFields(value, label) {
  if (
    !Array.isArray(value.tags) ||
    value.tags.length === 0 ||
    value.tags.some((tag) => typeof tag !== "string" || !TAG_PATTERN.test(tag))
  )
    throw new Error(`${label} tags must be a non-empty string array`);
  if (new Set(value.tags).size !== value.tags.length)
    throw new Error(`${label} tags must not contain duplicates`);
  if (!BLOG_STATUSES.includes(value.status))
    throw new Error(`${label} status must be draft or published`);
  if (value.hero_image !== undefined && !isLocalAssetPath(value.hero_image))
    throw new Error(`${label} hero_image must be a local asset path`);
  if (
    value.related_slugs !== undefined &&
    (!Array.isArray(value.related_slugs) ||
      value.related_slugs.some((slug) => typeof slug !== "string" || !SLUG_PATTERN.test(slug)))
  )
    throw new Error(`${label} related_slugs must be slug strings`);
  if (value.series !== undefined && (typeof value.series !== "string" || !value.series.trim()))
    throw new Error(`${label} series must be a non-empty string`);
  if (
    value.series_order !== undefined &&
    (!Number.isInteger(value.series_order) || value.series_order < 1)
  )
    throw new Error(`${label} series_order must be a positive integer`);
}

export default function __moduleApi0() {
  return { validateEditorialFields, BLOG_STATUSES };
}
