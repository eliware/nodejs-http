import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/static/page-tokens.mjs";
const { replacePageTokens } = __moduleApi0();

test("replaces runtime tokens in page content", () => {
  const result = replacePageTokens(
    Buffer.from("__HOST_ID__ __COPYRIGHT_YEAR__ __APP_VERSION__ __ASSET_VERSION__"),
  ).toString("utf8");
  expect(result).not.toMatch(/__(HOST_ID|COPYRIGHT_YEAR|APP_VERSION|ASSET_VERSION)__/);
});

test("escapes configured application versions in page tokens", () => {
  const original = process.env.APP_VERSION;
  process.env.APP_VERSION = '<img src=x onerror="run()">';
  try {
    const result = replacePageTokens(Buffer.from("__APP_VERSION__|__ASSET_VERSION__")).toString(
      "utf8",
    );
    expect(result).toBe(
      "&lt;img src=x onerror=&quot;run()&quot;&gt;|&lt;img src=x onerror=&quot;run()&quot;&gt;",
    );
  } finally {
    if (original === undefined) delete process.env.APP_VERSION;
    else process.env.APP_VERSION = original;
  }
});
