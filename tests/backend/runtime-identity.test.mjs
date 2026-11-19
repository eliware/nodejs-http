import { describe, expect, test } from "@jest/globals";
import __moduleApi0 from "../../src/backend/runtime-identity.mjs";
const { hostIdFromHostname, servingHostId } = __moduleApi0();

describe("runtime identity", () => {
  test("uses the final hostname segment as the short host id", () => {
    expect(hostIdFromHostname("http-worker-zwb8d")).toBe("zwb8d");
    expect(hostIdFromHostname("single-host")).toBe("host");
  });

  test("handles blank and null hostnames safely", () => {
    expect(hostIdFromHostname("   ")).toBe("unknown");
    expect(hostIdFromHostname(null)).toBe("unknown");
  });

  test("returns the current process host id", () => {
    expect(servingHostId()).toEqual(expect.any(String));
    expect(servingHostId().length).toBeGreaterThan(0);
  });
});
