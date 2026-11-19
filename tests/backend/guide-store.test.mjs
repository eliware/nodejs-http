import { platform } from "node:os";
import {
  createGuideFile,
  createRepositoryRoot,
  replaceWithOutsideSymlink,
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

const testSymlink = platform() === "win32" ? test.skip : test;

testSymlink("rejects a guide symlink that points outside the repository", async () => {
  const root = await createRepositoryRoot();
  const file = guideFilePath(root, "install", "centos10", "stable");
  await createGuideFile(root, file, "{}");
  await replaceWithOutsideSymlink(file);
  await expect(readGuide(root, "install", "centos10", "stable")).rejects.toThrow(
    "guide path is outside the repository",
  );
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

test("rejects a guide path that changes outside the root after opening", async () => {
  let fileReads = 0;
  let closed = false;
  const filesystem = {
    realpath: async (value) => {
      if (value === "/race-root") return "/race-root";
      fileReads += 1;
      return fileReads === 1 ? value : "/outside/instructions.json";
    },
    open: async () => ({
      stat: async () => ({ dev: 1, ino: 1 }),
      readFile: async () => "{}",
      close: async () => {
        closed = true;
      },
    }),
  };
  await expect(
    readGuide("/race-root", "install", "centos10", "stable", filesystem),
  ).rejects.toThrow("guide path is outside the repository");
  expect(closed).toBe(true);
});

test("rejects a guide file replaced between opening and validation", async () => {
  const openedFile = { dev: 1, ino: 1 };
  const filesystem = {
    realpath: async (value) => value,
    open: async () => ({
      stat: async () => openedFile,
      readFile: async () => "{}",
      close: async () => {},
    }),
    stat: async () => ({ dev: 1, ino: 2 }),
  };
  await expect(
    readGuide("/stable-root", "install", "centos10", "stable", filesystem),
  ).rejects.toThrow("guide file changed while it was being read");
});

test("keeps cache entries separate when a repository root changes target", async () => {
  let rootTarget = "/guide-root-a";
  const guide = {
    schemaVersion: 2,
    title: "Same guide",
    summary: "Summary",
    platform: "rpm",
    channel: "stable",
    source: { repository: "repo", upstream: "upstream" },
    sections: [],
  };
  const content = JSON.stringify(guide);
  const filesystem = {
    realpath: async (value) =>
      value === "/guide-alias" ? rootTarget : `${rootTarget}${value.slice("/guide-alias".length)}`,
    open: async () => ({
      stat: async () => ({ dev: 1, ino: 2 }),
      readFile: async () => content,
      close: async () => {},
    }),
    stat: async () => ({ dev: 1, ino: 2 }),
  };
  const first = await readGuide("/guide-alias", "install", "centos10", "stable", filesystem);
  rootTarget = "/guide-root-b";
  const second = await readGuide("/guide-alias", "install", "centos10", "stable", filesystem);
  expect(second).toEqual(first);
  expect(second).not.toBe(first);
});
