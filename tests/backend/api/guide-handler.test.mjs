import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/guide-handler.mjs";
const { handleGuideApi } = __moduleApi0();
import { createGuideFile, createRepositoryRoot } from "../../../test-fixtures/filesystem.mjs";

function response() {
  return {
    req: { method: "GET", headers: {} },
    statusCode: null,
    headers: {},
    body: "",
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body) {
      if (body !== undefined) this.body += body.toString();
    },
  };
}

const config = {
  publicDir: "missing-public-root",
  securityHeaders: false,
  compression: false,
};

function guide(overrides = {}) {
  return {
    schemaVersion: 2,
    title: "Install Node.js",
    summary: "Install Node.js from the repository.",
    platform: "rpm",
    channel: "stable",
    source: { repository: "https://example.test/repo", upstream: "https://example.test/node" },
    sections: [
      {
        title: "Install",
        steps: [
          {
            title: "Install the package",
            text: "Install the published RPM.",
            commands: ["dnf install eliware-node26"],
            verify: "Check node --version.",
          },
        ],
      },
    ],
    ...overrides,
  };
}

test("leaves paths outside the guide API to the router", async () => {
  expect(await handleGuideApi({}, "/not-a-guide", {})).toBe(false);
});

test.each([
  "/api/guides/delete/centos10/stable",
  "/api/guides/install/other/stable",
  "/api/guides/install/centos10/preview",
])("returns not found for unsupported guide coordinates: %s", async (path) => {
  const result = response();
  await expect(handleGuideApi(result, path, config)).resolves.toBe(true);
  expect(result.statusCode).toBe(404);
  expect(JSON.parse(result.body)).toEqual({ error: "guide not found" });
});

test("returns a valid guide document", async () => {
  const publicDir = await createRepositoryRoot();
  const guideDocument = guide();
  await createGuideFile(
    publicDir,
    `${publicDir}/content/install/centos10/stable/instructions.json`,
    JSON.stringify(guideDocument),
  );
  const result = response();
  await handleGuideApi(result, "/api/guides/install/centos10/stable", {
    ...config,
    publicDir,
  });
  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toEqual({
    schemaVersion: 1,
    action: "install",
    os: "centos10",
    channel: "stable",
    guide: guideDocument,
  });
});

test.each([
  ["upgrade", undefined],
  ["install", guide({ platform: "debian" })],
  ["install", "not JSON"],
])("returns not found when guide data is absent, invalid, or mismatched", async (action, value) => {
  const publicDir = await createRepositoryRoot();
  if (value !== undefined) {
    await createGuideFile(
      publicDir,
      `${publicDir}/content/${action}/centos10/stable/instructions.json`,
      typeof value === "string" ? value : JSON.stringify(value),
    );
  }
  const result = response();
  await handleGuideApi(result, `/api/guides/${action}/centos10/stable`, { ...config, publicDir });
  expect(result.statusCode).toBe(404);
  expect(JSON.parse(result.body)).toEqual({ error: "guide not found" });
});
