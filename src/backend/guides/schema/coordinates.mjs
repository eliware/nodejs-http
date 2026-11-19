import guidePathApi from "../path.mjs";
const { isGuideCoordinate, guidePlatform } = guidePathApi();

function validateGuideCoordinates(value, os, channel) {
  if (
    !value ||
    !isGuideCoordinate("install", os, channel) ||
    value.platform !== guidePlatform(os) ||
    value.channel !== channel
  )
    throw new Error("invalid guide");
}

export default function __moduleApi0() {
  return { validateGuideCoordinates };
}
