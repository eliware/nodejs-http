import blogFieldsApi from "./fields.mjs";
const { BLOG_SCHEMA, BLOG_STATUSES, BLOG_REQUIRED_FIELDS, BLOG_FIELDS } = blogFieldsApi();

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CATEGORIES = new Set([
  "installation",
  "upgrades",
  "operations",
  "architecture",
  "troubleshooting",
  "releases",
  "security",
  "kubernetes",
]);

function assertString(value, label) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${label} must be a non-empty string`);
}

function assertTimestamp(value, label) {
  assertString(value, label);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value))
    throw new Error(`${label} must be an ISO-8601 UTC timestamp`);
  if (Number.isNaN(Date.parse(value))) throw new Error(`${label} is invalid`);
}

function assertBlogCoreFields(value, label) {
  for (const field of BLOG_REQUIRED_FIELDS)
    if (!Object.hasOwn(value, field) || value[field] === null || value[field] === "")
      throw new Error(`${label} is missing required field: ${field}`);
  if (Object.hasOwn(value, "meta_version")) throw new Error(`${label} uses legacy meta_version`);
  if (value.schema !== BLOG_SCHEMA)
    throw new Error(
      `${label} schema ${String(value.schema)} is unsupported; expected ${BLOG_SCHEMA}`,
    );
  for (const field of Object.keys(value))
    if (!BLOG_FIELDS.has(field)) throw new Error(`${label} has unsupported field: ${field}`);
  if (!SLUG_PATTERN.test(value.slug))
    throw new Error(`${label} slug must contain lowercase letters, numbers, and hyphens`);
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
  assertString(value.title, `${label} title`);
  assertString(value.summary, `${label} summary`);
  assertTimestamp(value.published_at, `${label} published_at`);
  assertTimestamp(value.updated_at, `${label} updated_at`);
  assertTimestamp(value.created_at, `${label} created_at`);
  if (Date.parse(value.created_at) > Date.parse(value.published_at))
    throw new Error(`${label} created_at cannot follow published_at`);
  if (Date.parse(value.updated_at) < Date.parse(value.published_at))
    throw new Error(`${label} updated_at cannot precede published_at`);
  assertString(value.author, `${label} author`);
  if (value.content_format !== "markdown")
    throw new Error(`${label} content_format must be markdown`);
  if (!CATEGORIES.has(value.category)) throw new Error(`${label} category is unsupported`);
  assertTimestamp(value.last_verified_at, `${label} last_verified_at`);
  if (
    !Array.isArray(value.tested_on) ||
    value.tested_on.length === 0 ||
    value.tested_on.some((item) => typeof item !== "string" || !item.trim())
  )
    throw new Error(`${label} tested_on must be a non-empty string array`);
}

export default function __moduleApi0() {
  return { assertBlogCoreFields };
}
