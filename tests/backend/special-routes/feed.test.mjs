import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/special-routes/feed.mjs";
const { handleFeedRequest } = __moduleApi0();

test("leaves non-feed routes for the router", async () => {
  expect(await handleFeedRequest({}, {}, "/not-feed", {})).toBe(false);
});
