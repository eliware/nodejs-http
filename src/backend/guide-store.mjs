import path from "node:path";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const GUIDE_ACTIONS = ["install", "upgrade"];
const GUIDE_OSES = ["centos10", "alma10", "rocky10", "oracle10", "debian12", "ubuntu24"];
const GUIDE_CHANNELS = ["stable", "rolling"];
const GUIDE_PLATFORMS = ["rpm", "debian", "ubuntu"];
const GUIDE_PLATFORM_BY_OS = {
  centos10: "rpm",
  alma10: "rpm",
  rocky10: "rpm",
  oracle10: "rpm",
  debian12: "debian",
  ubuntu24: "ubuntu",
};
const cache = new Map();

function guideFilePath(publicDir, action, os, channel) {
  if (
    !GUIDE_ACTIONS.includes(action) ||
    !GUIDE_OSES.includes(os) ||
    !GUIDE_CHANNELS.includes(channel)
  )
    return null;
  return path.join(publicDir, "content", action, os, channel, "instructions.json");
}

function validateGuide(value, os, channel) {
  if (
    !value ||
    value.schemaVersion !== 2 ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    !GUIDE_PLATFORMS.includes(value.platform) ||
    value.platform !== GUIDE_PLATFORM_BY_OS[os] ||
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

async function readGuide(publicDir, action, os, channel) {
  const filePath = guideFilePath(publicDir, action, os, channel);
  if (!filePath) return null;
  const content = await readFile(filePath, "utf8");
  const signature = createHash("sha256").update(content).digest("hex");
  const cached = cache.get(filePath);
  if (cached?.signature === signature) return cached.value;
  const value = validateGuide(JSON.parse(content), os, channel);
  cache.set(filePath, { signature, value });
  return value;
}

export default function __moduleApi0() {
  return { GUIDE_ACTIONS, GUIDE_OSES, GUIDE_CHANNELS, guideFilePath, readGuide };
}
