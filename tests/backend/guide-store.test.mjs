import { expect, test } from "@jest/globals";
import path from "node:path";
import { createGuideFile, createRepositoryRoot } from "../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../src/backend/guide-store.mjs";
const { readGuide } = __moduleApi0();

function validGuide() {
  return {
    schemaVersion: 2,
    title: "Install",
    summary: "Summary",
    platform: "rpm",
    channel: "stable",
    source: { repository: "https://example.test/repo", upstream: "https://example.test/upstream" },
    sections: [
      {
        title: "Prepare",
        steps: [{ title: "Step", text: "Do it", commands: ["step"], verify: "it works" }],
      },
    ],
  };
}

test("loads and caches a validated guide from its coordinate", async () => {
  const root = await createRepositoryRoot();
  const file = path.join(root, "content", "install", "centos10", "stable", "instructions.json");
  const guide = validGuide();
  await createGuideFile(root, file, JSON.stringify(guide));
  const loaded = await readGuide(root, "install", "centos10", "stable");
  expect(loaded).toEqual(guide);
  await expect(readGuide(root, "install", "centos10", "stable")).resolves.toBe(loaded);
});

test("returns null for an unsupported guide coordinate", async () => {
  expect(await readGuide("/repo", "invalid", "centos10", "stable")).toBeNull();
});

test("rejects malformed guide data during store loading", async () => {
  const root = await createRepositoryRoot();
  const file = path.join(root, "content", "install", "centos10", "stable", "instructions.json");
  await createGuideFile(root, file, JSON.stringify({ schemaVersion: 2, title: "Incomplete" }));
  await expect(readGuide(root, "install", "centos10", "stable")).rejects.toThrow("invalid guide");
});
