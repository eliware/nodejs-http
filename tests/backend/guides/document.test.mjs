import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/guides/document.mjs";
const { parseGuideDocument } = __moduleApi0();

const guide = {
  schemaVersion: 2,
  title: "Install",
  summary: "Summary",
  platform: "rpm",
  channel: "stable",
  source: {
    repository: "https://example.test/repository",
    upstream: "https://example.test/upstream",
  },
  sections: [],
};

test("parses a guide document and validates its coordinate", () => {
  expect(parseGuideDocument(JSON.stringify(guide), "install", "centos10", "stable")).toEqual(guide);
});

test("rejects malformed JSON and mismatched coordinates", () => {
  expect(() => parseGuideDocument("{", "install", "centos10", "stable")).toThrow();
  expect(() => parseGuideDocument(JSON.stringify(guide), "install", "debian12", "stable")).toThrow(
    "invalid guide",
  );
});
