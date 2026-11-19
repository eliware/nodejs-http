import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/response/headers.mjs";
const { baseHeaders } = __moduleApi0();

test("builds configured security, CORS, and cache headers", () => {
  expect(baseHeaders({})).toEqual({});
  const headers = baseHeaders(
    { securityHeaders: true, corsOrigin: "https://example.test", cacheControl: "no-store" },
    { socket: { encrypted: true } },
  );
  expect(headers["Strict-Transport-Security"]).toContain("max-age");
  expect(headers["Access-Control-Allow-Origin"]).toBe("https://example.test");
  expect(headers["Cache-Control"]).toBe("no-store");
});
