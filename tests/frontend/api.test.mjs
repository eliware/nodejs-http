import { beforeEach, expect, jest, test } from "@jest/globals";

globalThis.location = { origin: "https://glusterfs.example" };
let api;
beforeEach(async () => {
  await jest.resetModules();
  api = (await import("../../src/frontend/api.mjs")).default();
});

test("fetches and caches catalog responses", async () => {
  const fetchMock = jest.fn(async () => ({ ok: true, json: async () => ({ catalog: true }) }));
  globalThis.fetch = fetchMock;
  await expect(api.fetchCatalog()).resolves.toEqual({ catalog: true });
  await expect(api.fetchCatalog()).resolves.toEqual({ catalog: true });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith("https://glusterfs.example/api/v1/catalog", {
    cache: "force-cache",
  });
  expect(api.origin).toBe("https://glusterfs.example");
});

test("encodes directory paths and fetches the index and release manifest", async () => {
  const fetchMock = jest.fn(async (url) => ({ ok: true, json: async () => url }));
  globalThis.fetch = fetchMock;
  await expect(api.fetchDirectory("/el10/x86_64/")).resolves.toContain("path=%2Fel10%2Fx86_64%2F");
  await expect(api.fetchRepositoryIndex()).resolves.toContain("/metadata/repository-index.json");
  await expect(api.fetchReleaseManifest()).resolves.toContain("/metadata/release-manifest.json");
  expect(fetchMock).toHaveBeenCalledTimes(3);
});

test("drops failed requests from the cache so callers can retry", async () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce({ ok: false, status: 503 })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ recovered: true }) });
  globalThis.fetch = fetchMock;
  await expect(api.fetchCatalog()).rejects.toThrow("request failed: 503");
  await expect(api.fetchCatalog()).resolves.toEqual({ recovered: true });
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
