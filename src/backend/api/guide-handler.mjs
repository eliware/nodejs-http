import __moduleApi1 from "../response.mjs";
const { sendJson } = __moduleApi1();
import __moduleApifix1 from "../guide-store.mjs";
const { readGuide } = __moduleApifix1();
import guidePathApi from "../guides/path.mjs";
const { GUIDE_ACTIONS, GUIDE_OSES, GUIDE_CHANNELS } = guidePathApi();

async function handleGuideApi(response, requestPath, config) {
  const match = requestPath.match(/^\/api\/guides\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (!match) return false;
  const [, action, os, channel] = match;
  if (
    !GUIDE_ACTIONS.includes(action) ||
    !GUIDE_OSES.includes(os) ||
    !GUIDE_CHANNELS.includes(channel)
  ) {
    sendJson(response, 404, { error: "guide not found" }, config, "no-store");
    return true;
  }
  try {
    const guide = await readGuide(config.publicDir, action, os, channel);
    sendJson(response, 200, { schemaVersion: 1, action, os, channel, guide }, config, "no-store");
  } catch {
    sendJson(response, 404, { error: "guide not found" }, config, "no-store");
  }
  return true;
}

export default function __moduleApi0() {
  return { handleGuideApi };
}
