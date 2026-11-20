import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/blog/article/hero.mjs";
const { renderBlogHero } = __moduleApi0();

test("renders an escaped hero image and title", () => {
  expect(renderBlogHero({ hero_image: "/assets/hero.png?a=1&b=2", title: "Safe <title>" })).toBe(
    '<img class="blog-hero-image" src="/assets/hero.png?a=1&amp;b=2" alt="Safe &lt;title&gt;" width="1200" height="630" loading="eager" />',
  );
});

test("omits a hero image when the post has no image", () => {
  expect(renderBlogHero({ title: "Guide" })).toBe("");
});
