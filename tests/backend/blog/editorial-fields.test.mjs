import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/blog/editorial-fields.mjs";
const { validateEditorialFields } = __moduleApi0();

test("accepts optional editorial fields", () => {
  const value = {
    hero_image: "/assets/hero.png",
    related_slugs: ["related-post"],
    series: "Installation",
    series_order: 1,
  };
  expect(validateEditorialFields(value, "post")).toBeUndefined();
  expect(validateEditorialFields({}, "post")).toBeUndefined();
});

test.each([
  [{ hero_image: 2 }, /hero_image/],
  [{ hero_image: "https://example.test/image.png" }, /hero_image/],
  [{ related_slugs: "post" }, /related_slugs/],
  [{ related_slugs: ["Bad Slug"] }, /related_slugs/],
  [{ series: 2 }, /series/],
  [{ series: " " }, /series/],
  [{ series_order: 0 }, /series_order/],
  [{ series_order: 1.5 }, /series_order/],
])("rejects invalid optional editorial fields", (value, expected) => {
  expect(() => validateEditorialFields(value, "post")).toThrow(expected);
});
