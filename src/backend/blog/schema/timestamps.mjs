function assertTimestamp(value, label) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${label} must be a non-empty string`);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value))
    throw new Error(`${label} must be an ISO-8601 UTC timestamp`);
  if (Number.isNaN(Date.parse(value))) throw new Error(`${label} is invalid`);
}

function assertBlogTimestamps(value, label) {
  assertTimestamp(value.published_at, `${label} published_at`);
  assertTimestamp(value.updated_at, `${label} updated_at`);
  assertTimestamp(value.created_at, `${label} created_at`);
  if (Date.parse(value.created_at) > Date.parse(value.published_at))
    throw new Error(`${label} created_at cannot follow published_at`);
  if (Date.parse(value.updated_at) < Date.parse(value.published_at))
    throw new Error(`${label} updated_at cannot precede published_at`);
}

export default function __moduleApi0() {
  return { assertBlogTimestamps, assertTimestamp };
}
