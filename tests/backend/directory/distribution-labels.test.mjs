import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/distribution-labels.mjs";
const { distributionLabels } = __moduleApi0();

test("provides labels for supported distributions", () => {
  expect(distributionLabels["centos-stream-10"]).toBe("CentOS Stream 10");
  expect(Object.keys(distributionLabels)).toHaveLength(6);
});
