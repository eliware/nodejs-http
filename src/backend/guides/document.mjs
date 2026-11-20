import __moduleApifix1 from "./schema.mjs";
const { validateGuide } = __moduleApifix1();
import __moduleApifix2 from "./coordinates.mjs";
const { validateGuideCoordinate } = __moduleApifix2();

function parseGuideDocument(content, action, os, channel) {
  return validateGuideCoordinate(validateGuide(JSON.parse(content)), action, os, channel);
}

export default function __moduleApi0() {
  return { parseGuideDocument };
}
