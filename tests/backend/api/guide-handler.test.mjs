import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/guide-handler.mjs";
const { handleGuideApi } = __moduleApi0();

test("leaves paths outside the guide API to the router", async () => {
  expect(await handleGuideApi({}, "/not-a-guide", {})).toBe(false);
});
