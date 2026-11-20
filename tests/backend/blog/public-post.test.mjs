import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/blog/public-post.mjs";
const { publicBlogPost } = __moduleApi0();

test("adds rendered article HTML without changing the stored post", () => {
  const post = {
    slug: "safe-post",
    title: "Safe post",
    summary: "Summary",
    content: "# Safe post\n\nArticle.",
  };
  const result = publicBlogPost(post);
  expect(result).toMatchObject({ ...post, html: expect.stringContaining("Article.") });
  expect(post).not.toHaveProperty("html");
});
