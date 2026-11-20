import { expect, jest, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/blog/request.mjs";
const { requestBlogJson } = __moduleApi0();

test("fetches blog JSON without using the cache", async () => {
  const payload = { posts: [] };
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => payload }));
  await expect(requestBlogJson("/api/v1/blogs")).resolves.toBe(payload);
  expect(globalThis.fetch).toHaveBeenCalledWith("/api/v1/blogs", { cache: "no-store" });
});

test("reports an unsuccessful blog response", async () => {
  globalThis.fetch = jest.fn(async () => ({ ok: false, status: 503 }));
  await expect(requestBlogJson("/api/v1/blogs")).rejects.toThrow("blog request failed: 503");
});
