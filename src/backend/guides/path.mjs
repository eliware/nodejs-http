import path from "node:path";

const GUIDE_ACTIONS = ["install", "upgrade"];
const GUIDE_OSES = ["centos10", "alma10", "rocky10", "oracle10", "debian12", "ubuntu24"];
const GUIDE_CHANNELS = ["stable", "rolling"];
const GUIDE_PLATFORM_BY_OS = {
  centos10: "rpm",
  alma10: "rpm",
  rocky10: "rpm",
  oracle10: "rpm",
  debian12: "debian",
  ubuntu24: "ubuntu",
};

function isGuideCoordinate(action, os, channel) {
  return (
    GUIDE_ACTIONS.includes(action) && GUIDE_OSES.includes(os) && GUIDE_CHANNELS.includes(channel)
  );
}

function guideFilePath(publicDir, action, os, channel) {
  if (!isGuideCoordinate(action, os, channel)) return null;
  return path.join(publicDir, "content", action, os, channel, "instructions.json");
}

function guidePlatform(os) {
  return GUIDE_PLATFORM_BY_OS[os];
}

export default function __moduleApi0() {
  return {
    GUIDE_ACTIONS,
    GUIDE_OSES,
    GUIDE_CHANNELS,
    isGuideCoordinate,
    guideFilePath,
    guidePlatform,
  };
}
