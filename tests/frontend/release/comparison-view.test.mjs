import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/release/comparison-view.mjs";
const { renderComparisonView } = __moduleApi0();

test("renders release package counts and labels", () => {
  expect(
    renderComparisonView(
      { channel: "stable", label: "Stable 26.13.0" },
      { channel: "stable", label: "Stable 26.13.1" },
      3,
      4,
    ),
  ).toBe(
    "<div><span>Packages</span><strong>3 → 4</strong></div><div><span>Channel</span><strong>stable → stable</strong></div><div><span>Release</span><strong>Stable 26.13.0 → Stable 26.13.1</strong></div>",
  );
});
