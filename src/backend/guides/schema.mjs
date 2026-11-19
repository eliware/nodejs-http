import guidePathApi from "./path.mjs";
const { GUIDE_CHANNELS, isGuideCoordinate, guidePlatform } = guidePathApi();

const GUIDE_PLATFORMS = ["rpm", "debian", "ubuntu"];

function validateGuide(value, os, channel) {
  if (
    !isGuideCoordinate("install", os, channel) ||
    !value ||
    value.schemaVersion !== 2 ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    !GUIDE_PLATFORMS.includes(value.platform) ||
    value.platform !== guidePlatform(os) ||
    !GUIDE_CHANNELS.includes(value.channel) ||
    value.channel !== channel ||
    !value.source ||
    typeof value.source.repository !== "string" ||
    typeof value.source.upstream !== "string" ||
    !Array.isArray(value.sections) ||
    value.sections.some(
      (section) =>
        !section ||
        typeof section.title !== "string" ||
        !Array.isArray(section.steps) ||
        section.steps.some(
          (step) =>
            !step ||
            typeof step.title !== "string" ||
            typeof step.text !== "string" ||
            !Array.isArray(step.commands) ||
            step.commands.some((command) => typeof command !== "string") ||
            typeof step.verify !== "string",
        ),
    )
  )
    throw new Error("invalid guide");
  return value;
}

export default function __moduleApi0() {
  return { validateGuide };
}
