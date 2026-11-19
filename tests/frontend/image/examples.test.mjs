import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/examples.mjs";
const { exampleFor } = __moduleApi0();

const record = {
  repository: "ghcr.io/eliware/centos10-node26",
  image: {
    repository: "ghcr.io/eliware/centos10-node26",
    digest: "sha256:123",
    reference: "ghcr.io/eliware/centos10-node26:26.13.1",
  },
};

test.each([
  ["dockerfile", "FROM ghcr.io/eliware/centos10-node26:26.13.1"],
  ["compose", "services:"],
  ["kubernetes", "apiVersion: apps/v1"],
])("generates the %s example", (kind, expected) => {
  expect(exampleFor(record, kind, "tag")).toContain(expected);
});

test("uses digest and tag references", () => {
  expect(exampleFor(record, "dockerfile", "sha")).toContain("@sha256:123");
  expect(exampleFor(record, "dockerfile", "tag")).toContain(":26.13.1");
});
