const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function isLocalAssetPath(value) {
  if (typeof value !== "string" || !value.startsWith("/assets/") || value.includes("\\"))
    return false;
  const assetUrl = new URL(value, "https://assets.invalid");
  return assetUrl.origin === "https://assets.invalid" && assetUrl.pathname.startsWith("/assets/");
}

function validateEditorialFields(value, label) {
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
  return { validateEditorialFields };
}
