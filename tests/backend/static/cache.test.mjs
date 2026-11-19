import { expect } from "@jest/globals";
import path from "node:path";
import { createStaticDirectory } from "../../../test-fixtures/filesystem.mjs";
import __moduleApi0 from "../../../src/backend/static/cache.mjs";
const { preloadStaticCache } = __moduleApi0();

test("preloads eligible files and respects disabled or capacity limits", async () => {
  const publicDir = await createStaticDirectory();
  const config = {
    publicDir,
    ramCache: false,
    ramCachePaths: [],
    ramCacheMaxBytes: 100,
  };

  expect(await preloadStaticCache(config)).toEqual(new Map());
  config.ramCache = true;
  config.ramCachePaths = ["/hello.txt", "index.html", "/missing", "/folder"];
  const cache = await preloadStaticCache(config);
  expect([...cache.keys()].map((file) => path.basename(file)).sort()).toEqual([
    "hello.txt",
    "index.html",
  ]);
  config.ramCacheMaxBytes = 1;
  expect(await preloadStaticCache(config)).toEqual(new Map());
});

test("skips cached paths that resolve outside the public root", async () => {
  const root = "C:\\public";
  const outside = "C:\\outside\\secret.txt";
  const filesystem = {
    realpath: async (value) => (value === root ? root : outside),
    stat: async () => {
      throw new Error("outside path");
    },
    readFile: async () => Buffer.from("secret"),
  };

  await expect(
    preloadStaticCache(
      {
        publicDir: root,
        ramCache: true,
        ramCachePaths: ["secret.txt"],
        ramCacheMaxBytes: 1024,
      },
      filesystem,
    ),
  ).resolves.toEqual(new Map());
});
