import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/config/http.mjs";
const { DEFAULT_HOST, DEFAULT_PORT, loadHttpConfig } = __moduleApi0();

test("loads HTTP defaults and directory behavior", () => {
  expect(loadHttpConfig({})).toMatchObject({
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    directoryIndex: true,
    directoryListing: true,
    directoryRedirect: 301,
    allowDotfiles: false,
    allowSymlinks: false,
    compression: true,
    compressionMinBytes: 256,
  });
});

test("parses HTTP environment overrides", () => {
  expect(
    loadHttpConfig({
      HOST: "127.0.0.1",
      PORT: "8080",
      DIRECTORY_REDIRECT: "308",
      DIRECTORY_LISTING: "false",
      ALLOW_GET: "false",
      CORS_ORIGIN: "https://example.test",
      COMPRESSION: "false",
      COMPRESSION_MIN_BYTES: "512",
    }),
  ).toMatchObject({
    host: "127.0.0.1",
    port: 8080,
    directoryRedirect: 308,
    directoryListing: false,
    allowGet: false,
    corsOrigin: "https://example.test",
    compression: false,
    compressionMinBytes: 512,
  });
});
