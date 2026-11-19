import __moduleApi1 from "../metadata/version.mjs";
const { assertMetadataVersion } = __moduleApi1();
import __moduleApifix1 from "./editorial-fields.mjs";
const { validateEditorialFields } = __moduleApifix1();
import __moduleApifix2 from "./schema/fields.mjs";
const { BLOG_SCHEMA, BLOG_STATUSES, BLOG_REQUIRED_FIELDS, assertBlogCoreFields } =
  __moduleApifix2();
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertBlogDocument(value, label = "blog document") {
  assertMetadataVersion(value, label);
  assertBlogCoreFields(value, label);
  validateEditorialFields(value, label);
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
  if (typeof value.content !== "string" || !value.content.trim())
    throw new Error(`${label} content must be a non-empty string`);
  return value;
}

export default function __moduleApi0() {
  return { BLOG_SCHEMA, BLOG_STATUSES, BLOG_REQUIRED_FIELDS, assertBlogDocument };
}
