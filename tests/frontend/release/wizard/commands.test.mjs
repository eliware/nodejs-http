import { expect, test } from "@jest/globals";

test("combines package and image command actions", async () => {
  globalThis.location = { origin: "https://repo.example" };
  const { default: api } = await import("../../../../src/frontend/release/wizard/commands.mjs");
  const commands = api();
  expect(commands.setPackageManager).toBeInstanceOf(Function);
  expect(commands.updateCommand).toBeInstanceOf(Function);
  expect(commands.setImageReferenceMode).toBeInstanceOf(Function);
  expect(commands.updateContainerCommand).toBeInstanceOf(Function);
});
