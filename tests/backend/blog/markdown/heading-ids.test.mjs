import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/markdown/heading-ids.mjs";
const { createHeadingIdGenerator } = __moduleApi0();

test("creates normalized, unique heading IDs", () => {
  const headingId = createHeadingIdGenerator();
  expect(headingId("A Heading!")).toBe("a-heading");
  expect(headingId("A Heading!")).toBe("a-heading-2");
  expect(headingId("!!!")).toBe("section");
});
