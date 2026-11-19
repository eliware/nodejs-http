import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/response/file-headers.mjs";
const { fileHeaders } = __moduleApi0();

test("builds MIME and configured file metadata headers", () => {
  const stats = { size: 32, mtime: new Date("2026-01-01T00:00:00Z"), mtimeMs: 10_000 };
  const headers = fileHeaders("file.json", stats, {
    defaultMimeType: "binary",
    lastModified: true,
    etag: true,
  });
  expect(headers["Content-Type"]).toContain("application/json");
  expect(headers["Last-Modified"]).toBe(stats.mtime.toUTCString());
  expect(headers.ETag).toBe('W/"20-2710"');
  expect(fileHeaders("file.unknown", stats, { defaultMimeType: "binary" })["Content-Type"]).toBe(
    "binary",
  );
});
