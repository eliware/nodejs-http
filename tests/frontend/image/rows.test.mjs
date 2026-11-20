import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/image/rows.mjs";

test("exports the folder and image row renderers", () => {
  expect(Object.keys(__moduleApi0()).sort()).toEqual(["renderFolderRow", "renderImageRow"]);
});
