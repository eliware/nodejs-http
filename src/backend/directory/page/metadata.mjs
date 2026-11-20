import { APP_VERSION } from "../../app-version.mjs";
import runtimeIdentityApi from "../../runtime-identity.mjs";
const { servingHostId } = runtimeIdentityApi();
import copyrightYearApi from "../copyright-year.mjs";
const { copyrightYear } = copyrightYearApi();

function pageMetadata() {
  const appVersion = process.env.APP_VERSION || APP_VERSION;
  return {
    appVersion,
    assetVersion: appVersion,
    copyrightYear: copyrightYear(),
    hostId: servingHostId(),
  };
}

export default function __moduleApi0() {
  return { pageMetadata };
}
