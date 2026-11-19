import guidePathApi from "./path.mjs";
const { isGuideCoordinate, guidePlatform } = guidePathApi();

function validateGuideCoordinate(value, os, channel) {
  if (
    !isGuideCoordinate("install", os, channel) ||
    value.platform !== guidePlatform(os) ||
    value.channel !== channel
  )
    throw new Error("invalid guide");
  return value;
}

export default function __moduleApi0() {
  return { validateGuideCoordinate };
}
