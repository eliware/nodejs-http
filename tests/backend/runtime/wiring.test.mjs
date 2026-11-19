import { expect, test } from "@jest/globals";
import { runtimeDependencies } from "../../../src/backend/runtime/wiring.mjs";

test("exposes the runtime application dependencies", () => {
  expect(runtimeDependencies.loadConfig).toEqual(expect.any(Function));
  expect(runtimeDependencies.preloadStaticCache).toEqual(expect.any(Function));
  expect(runtimeDependencies.createApplication).toEqual(expect.any(Function));
});
