const GUIDE_PLATFORMS = ["rpm", "debian", "ubuntu"];
const GUIDE_CHANNELS = ["stable", "rolling"];

function isHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function validateGuide(value) {
  if (
    !value ||
    value.schemaVersion !== 2 ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    !GUIDE_PLATFORMS.includes(value.platform) ||
    !GUIDE_CHANNELS.includes(value.channel) ||
    !value.source ||
    !isHttpUrl(value.source.repository) ||
    !isHttpUrl(value.source.upstream) ||
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
