import __moduleApi1 from "./schema/fields.mjs";
const { BLOG_SCHEMA, BLOG_STATUSES, BLOG_REQUIRED_FIELDS } = __moduleApi1();
import __moduleApifix1 from "./schema/validator.mjs";
const { assertBlogDocument } = __moduleApifix1();

export default function __moduleApi0() {
  return { BLOG_SCHEMA, BLOG_STATUSES, BLOG_REQUIRED_FIELDS, assertBlogDocument };
}
