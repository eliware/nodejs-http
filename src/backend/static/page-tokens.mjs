import { APP_VERSION } from "../app-version.mjs";
import __moduleApifix1 from "../runtime-identity.mjs";
const { servingHostId } = __moduleApifix1();
import __moduleApifix2 from "../directory/presentation.mjs";
const { copyrightYear } = __moduleApifix2();

function replacePageTokens(body) {
  return Buffer.from(
    body
      .toString("utf8")
      .replaceAll("__HOST_ID__", servingHostId())
      .replaceAll("__COPYRIGHT_YEAR__", copyrightYear())
      .replaceAll("__APP_VERSION__", process.env.APP_VERSION || APP_VERSION)
      .replaceAll("__ASSET_VERSION__", process.env.APP_VERSION || APP_VERSION),
  );
}

export default function __moduleApi0() {
  return { replacePageTokens };
}
