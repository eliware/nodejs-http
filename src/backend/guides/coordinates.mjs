import guidePathApi from "./path.mjs";
const { isGuideCoordinate, guidePlatform } = guidePathApi();

function validateGuideCoordinate(value, action, os, channel) {
  if (
    !isGuideCoordinate(action, os, channel) ||
    value.platform !== guidePlatform(os) ||
    value.channel !== channel
  )
    throw new Error("invalid guide");
  return value;
}

export default function __moduleApi0() {
  return { validateGuideCoordinate };
}
