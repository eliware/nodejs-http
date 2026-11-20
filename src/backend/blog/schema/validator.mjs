import __moduleApi1 from "../../metadata/version.mjs";
const { assertMetadataVersion } = __moduleApi1();
import __moduleApifix1 from "../editorial-fields.mjs";
const { validateEditorialFields } = __moduleApifix1();
import __moduleApifix3 from "./core.mjs";
const { assertBlogCoreFields } = __moduleApifix3();

function assertBlogDocument(value, label = "blog document") {
  assertMetadataVersion(value, label);
  assertBlogCoreFields(value, label);
  validateEditorialFields(value, label);
  if (typeof value.content !== "string" || !value.content.trim())
    throw new Error(`${label} content must be a non-empty string`);
  return value;
}

export default function __moduleApi0() {
  return { assertBlogDocument };
}
