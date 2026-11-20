import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/entries.mjs";
const { readDirectoryEntries } = __moduleApi0();

const entry = (name, kind) => ({
  name,
  isDirectory: () => kind === "directory",
  isFile: () => kind === "file",
  isSymbolicLink: () => kind === "link",
});

test("filters dotfiles and encodes every path segment", async () => {
  const filesystem = {
    readdir: async () => [entry(".hidden", "file"), entry("file #1.rpm", "file")],
  };
  const entries = await readDirectoryEntries(
    filesystem,
    "/repo/dir with%name",
    "/repo",
    "/dir with%name",
    {
      allowDotfiles: false,
      allowSymlinks: false,
    },
  );
  expect(entries.map(({ name }) => name)).not.toContain(".hidden");
  expect(entries[0].href).toBe("/dir%20with%25name/file%20%231.rpm");
});

test("classifies allowed in-root symlinks and hides outside or broken links", async () => {
  const publicDir = "/repo";
  const links = ["linked-dir", "outside-link", "broken-link"];
  const filesystem = {
    readdir: async () => links.map((name) => entry(name, "link")),
    realpath: async (value) => {
      if (value.endsWith("outside-link")) return "/outside/target";
      if (value.endsWith("broken-link")) throw new Error("broken link");
      return "/repo/folder/linked-dir";
    },
    stat: async () => ({ isDirectory: () => true, isFile: () => false }),
  };
  const entries = await readDirectoryEntries(filesystem, publicDir, publicDir, "/folder/", {
    allowDotfiles: false,
    allowSymlinks: true,
  });
  expect(entries.find((entry) => entry.name === "linked-dir")).toEqual({
    name: "linked-dir",
    type: "directory",
    href: "/folder/linked-dir/",
  });
  expect(entries.map(({ name }) => name)).toEqual(["linked-dir"]);
});

test("hides disallowed links, special entries, and links to special files", async () => {
  const publicDir = "/repo";
  const filesystem = {
    readdir: async () =>
      [
        "disallowed-link",
        "outside-link",
        "unresolved-link",
        "file-link",
        "socket-link",
        "socket",
      ].map((name) => entry(name, name === "socket" ? "special" : "link")),
    realpath: async (value) => {
      if (value.endsWith("outside-link")) return "/outside";
      if (value.endsWith("unresolved-link")) throw new Error("broken link");
      return `/repo/${value.split("/").at(-1)}`;
    },
    stat: async (value) => ({
      isDirectory: () => false,
      isFile: () => value.endsWith("file-link"),
    }),
  };
  const disallowed = await readDirectoryEntries(filesystem, publicDir, publicDir, "/", {
    allowDotfiles: false,
    allowSymlinks: false,
  });
  expect(disallowed).toEqual([]);
  const allowed = await readDirectoryEntries(filesystem, publicDir, publicDir, "/", {
    allowDotfiles: false,
    allowSymlinks: true,
  });
  expect(allowed).toEqual([{ name: "file-link", type: "file", href: "/file-link" }]);
});
