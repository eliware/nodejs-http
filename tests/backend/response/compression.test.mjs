import { expect, test } from "@jest/globals";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import __moduleApi0 from "../../../src/backend/response/compression.mjs";
const { chooseEncoding, compressBody } = __moduleApi0();

const config = { compression: true, compressionMinBytes: 1 };

test("chooses supported encodings and skips ineligible content", () => {
  expect(
    chooseEncoding({ headers: { "accept-encoding": "gzip, br" } }, "text/html", 8, config),
  ).toBe("br");
  expect(
    chooseEncoding({ headers: { "accept-encoding": "gzip;q=1" } }, "application/json", 8, config),
  ).toBe("gzip");
  expect(
    chooseEncoding(
      { headers: { "accept-encoding": "br;q=0, gzip;q=1" } },
      "application/json",
      8,
      config,
    ),
  ).toBe("gzip");
  expect(
    chooseEncoding(
      { headers: { "accept-encoding": "br;q=0.2, gzip;q=0.8" } },
      "application/json",
      8,
      config,
    ),
  ).toBe("gzip");
  expect(
    chooseEncoding(
      { headers: { "accept-encoding": "br;q=invalid, gzip;q=0" } },
      "application/json",
      8,
      config,
    ),
  ).toBeNull();
  expect(
    chooseEncoding(
      { headers: { "accept-encoding": "br;q=0, *;q=1" } },
      "application/json",
      8,
      config,
    ),
  ).toBe("gzip");
  expect(
    chooseEncoding(
      { headers: { "accept-encoding": "br;q=0, br;q=1, gzip;q=0.5" } },
      "application/json",
      8,
      config,
    ),
  ).toBe("gzip");
  expect(
    chooseEncoding({ headers: { "accept-encoding": "*;q=0.5" } }, "application/json", 8, config),
  ).toBe("br");
  expect(
    chooseEncoding({ headers: { "accept-encoding": "*;q=0" } }, "application/json", 8, config),
  ).toBeNull();
  expect(chooseEncoding({}, "text/html", 8, config)).toBeNull();
  expect(
    chooseEncoding({ headers: { "accept-encoding": "br" } }, "image/png", 8, config),
  ).toBeNull();
  expect(
    chooseEncoding({ headers: { "accept-encoding": "br" } }, "text/html", 0, config),
  ).toBeNull();
  expect(
    chooseEncoding({ headers: { "accept-encoding": "br" } }, "text/html", 8, {
      ...config,
      compression: false,
    }),
  ).toBeNull();
});

test("compresses bodies with Brotli or gzip and returns plain bodies unchanged", async () => {
  const body = Buffer.from("repository metadata content");
  const brotli = await compressBody(
    body,
    { headers: { "accept-encoding": "br" } },
    "text/plain",
    config,
  );
  const gzip = await compressBody(
    body,
    { headers: { "accept-encoding": "gzip" } },
    "text/plain",
    config,
  );

  expect(brotli.headers).toEqual({ "Content-Encoding": "br", Vary: "Accept-Encoding" });
  expect(brotliDecompressSync(brotli.body).toString()).toBe(body.toString());
  expect(gunzipSync(gzip.body).toString()).toBe(body.toString());
  expect(await compressBody(body, {}, "text/plain", config)).toEqual({
    body,
    headers: { Vary: "Accept-Encoding" },
  });
  expect(await compressBody(body, {}, "text/plain", { ...config, compression: false })).toEqual({
    body,
    headers: {},
  });
});
