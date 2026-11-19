const BLOG_SCHEMA = 2;
const BLOG_STATUSES = ["draft", "published"];
const BLOG_REQUIRED_FIELDS = [
  "metadata_version",
  "schema",
  "slug",
  "title",
  "summary",
  "published_at",
  "updated_at",
  "author",
  "tags",
  "status",
  "content",
  "content_format",
  "created_at",
  "category",
  "last_verified_at",
  "tested_on",
];
const BLOG_FIELDS = new Set([
  ...BLOG_REQUIRED_FIELDS,
  "hero_image",
  "related_slugs",
  "series",
  "series_order",
]);

export default function __moduleApi0() {
  return { BLOG_SCHEMA, BLOG_STATUSES, BLOG_REQUIRED_FIELDS, BLOG_FIELDS };
}
