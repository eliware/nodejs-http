import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/backend/directory/page/renderer.mjs";
const { renderDirectoryPage } = __moduleApi0();

test("selects the fallback page when no template exists", () => {
  expect(renderDirectoryPage(null, "Index of /repo/", "<tr>row</tr>", {})).toContain(
    "Index of /repo/",
  );
});

test("renders the configured template when available", () => {
  expect(
    renderDirectoryPage("{{TITLE}} {{ROWS}}", "Ignored", "<tr>row</tr>", {
      title: "Index of /repo/",
      rows: "<tr>row</tr>",
    }),
  ).toBe("Index of /repo/ <tr>row</tr>");
});
