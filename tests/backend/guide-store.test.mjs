import path from "node:path";
import {
  createGuideFile,
  createRepositoryRoot,
  replaceFileWithoutChangingTimestamp,
} from "../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../src/backend/guide-store.mjs";
const { guideFilePath, readGuide } = __moduleApi0();

test("guides resolve from the hierarchical repository content path", async () => {
  const root = await createRepositoryRoot();
  const file = guideFilePath(root, "install", "centos10", "stable");
  const guide = {
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
  await createGuideFile(root, file, JSON.stringify(guide));
  const loaded = await readGuide(root, "install", "centos10", "stable");
  expect(loaded).toEqual(guide);
  await expect(readGuide(root, "install", "centos10", "stable")).resolves.toBe(loaded);
  expect(guideFilePath(root, "install", "container", "stable")).toBeNull();
  expect(guideFilePath(root, "invalid", "centos10", "stable")).toBeNull();
  expect(guideFilePath(root, "install", "centos10", "invalid")).toBeNull();
  await expect(readGuide(root, "invalid", "centos10", "stable")).resolves.toBeNull();
});

test.each([
  ["platform", { platform: "debian" }],
  ["channel", { channel: "stable" }],
])("rejects guide data with a mismatched requested %s", async (_name, changes) => {
  const root = await createRepositoryRoot();
  const file = guideFilePath(root, "upgrade", "rocky10", "rolling");
  const guide = {
    schemaVersion: 2,
    title: "Upgrade",
    summary: "Summary",
    platform: "rpm",
    channel: "rolling",
    source: { repository: "repo", upstream: "upstream" },
    sections: [],
    ...changes,
  };
  await createGuideFile(root, file, JSON.stringify(guide));
  await expect(readGuide(root, "upgrade", "rocky10", "rolling")).rejects.toThrow("invalid guide");
});

test("rejects the mismatched guide fixture", async () => {
  const root = path.resolve("test-fixtures/guide-store-fixture");
  await expect(readGuide(root, "upgrade", "rocky10", "rolling")).rejects.toThrow("invalid guide");
});

test.each([
  null,
  {},
  { schemaVersion: 2, title: "Guide", summary: "Summary", sections: [null] },
  { schemaVersion: 2, title: "Guide", summary: "Summary", sections: [{ title: "S" }] },
  {
    schemaVersion: 2,
    title: "Guide",
    summary: "Summary",
    sections: [{ title: "S", steps: [null] }],
  },
  {
    schemaVersion: 2,
    title: "Guide",
    summary: "Summary",
    platform: "rpm",
    channel: "stable",
    source: { repository: "repo", upstream: "upstream" },
    sections: [{ title: "S", steps: [{ title: "Step", commands: [1] }] }],
  },
  {
    schemaVersion: 2,
    title: "Guide",
    summary: "Summary",
    platform: "rpm",
    channel: "stable",
    source: { repository: "repo", upstream: "upstream" },
    sections: [{ title: "S", steps: [{ title: "Step", text: "Do it", commands: ["run"] }] }],
  },
  {
    schemaVersion: 2,
    title: "Guide",
    summary: "Summary",
    platform: "rpm",
    channel: "stable",
    source: { repository: "repo", upstream: "upstream" },
    sections: [
      { title: "S", steps: [{ title: "Step", text: "Do it", commands: ["run"], verify: 2 }] },
    ],
  },
  {
    schemaVersion: 2,
    title: "Guide",
    summary: "Summary",
    platform: "invalid",
    channel: "stable",
    source: { repository: "repo", upstream: "upstream" },
    sections: [],
  },
  {
    schemaVersion: 2,
    title: "Guide",
    summary: "Summary",
    platform: "rpm",
    channel: "invalid",
    source: { repository: "repo", upstream: "upstream" },
    sections: [],
  },
  {
    schemaVersion: 2,
    title: "Guide",
    summary: "Summary",
    platform: "rpm",
    channel: "stable",
    source: { repository: "repo" },
    sections: [],
  },
])("rejects malformed guide data", async (guide) => {
  const root = await createRepositoryRoot();
  const file = guideFilePath(root, "upgrade", "rocky10", "rolling");
  await createGuideFile(root, file, JSON.stringify(guide));
  await expect(readGuide(root, "upgrade", "rocky10", "rolling")).rejects.toThrow("invalid guide");
});

test("reloads guide content when bytes change without a size or timestamp change", async () => {
  const root = await createRepositoryRoot();
  const file = guideFilePath(root, "install", "centos10", "stable");
  const guide = {
    schemaVersion: 2,
    title: "Install",
    summary: "Summary",
    platform: "rpm",
    channel: "stable",
    source: { repository: "repo", upstream: "upstream" },
    sections: [],
  };
  await createGuideFile(root, file, JSON.stringify(guide));
  await readGuide(root, "install", "centos10", "stable");
  const changed = structuredClone(guide);
  changed.title = "Updated";
  const nextContent = JSON.stringify(changed);
  expect(nextContent).toHaveLength(JSON.stringify(guide).length);
  await replaceFileWithoutChangingTimestamp(file, nextContent);
  expect((await readGuide(root, "install", "centos10", "stable")).title).toBe("Updated");
});
