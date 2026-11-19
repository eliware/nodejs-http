import { expect, test } from "@jest/globals";
import { createRepositoryRoot } from "../../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../../src/backend/directory/tree.mjs";
const { listFilesystemDirectories } = __moduleApi0();

test("walks nested directories and applies dotfile visibility", async () => {
  const publicDir = await createRepositoryRoot();
  const visible = await listFilesystemDirectories({ publicDir, allowDotfiles: false });
  const all = await listFilesystemDirectories({ publicDir, allowDotfiles: true });

  expect(visible).toContain("/");
  expect(visible).toContain("/el10/");
  expect(visible).not.toContain("/.hidden/");
  expect(all).toContain("/.hidden/");
});
