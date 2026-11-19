import { APP_VERSION } from "../app-version.mjs";
import __moduleApifix1 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApifix1();
import __moduleApifix2 from "../directory/presentation.mjs";
const { copyrightYear, escapeHtml } = __moduleApifix2();

function replacePageTokens(body) {
  const appVersion = escapeHtml(process.env.APP_VERSION || APP_VERSION);
  return Buffer.from(
    body
      .toString("utf8")
      .replaceAll("__HOST_ID__", servingHostId())
      .replaceAll("__COPYRIGHT_YEAR__", copyrightYear())
      .replaceAll("__APP_VERSION__", appVersion)
      .replaceAll("__ASSET_VERSION__", appVersion),
  );
}

export default function __moduleApi0() {
  return { replacePageTokens };
}
