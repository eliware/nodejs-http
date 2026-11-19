import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/api/blog-handler.mjs";
const { handleBlogApi } = __moduleApi0();

test("leaves paths outside the blog API to the router", async () => {
  expect(await handleBlogApi({}, "/not-a-blog", {})).toBe(false);
});
