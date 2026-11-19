import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/frontend/directory/validation.mjs";
const { renderValidation } = __moduleApi0();
import { BrowserElement, installBrowserDom } from "../../../test-fixtures/browser-dom.mjs";

test("returns when the validation elements are missing", () => {
  installBrowserDom();
  renderValidation({});
});

test("returns when no validation distributions exist", () => {
  const { get } = installBrowserDom({ ids: ["directory-validation", "directory-validation-rows"] });
  renderValidation({});
  expect(get("directory-validation").hidden).toBe(false);
});

test("renders package, container, repository, and provenance states", () => {
  const { get } = installBrowserDom({ ids: ["directory-validation", "directory-validation-rows"] });
  const section = get("directory-validation");
  const body = get("directory-validation-rows");
  const headers = Array.from({ length: 5 }, () => new BrowserElement("th"));
  const cells = Array.from({ length: 5 }, () => new BrowserElement("td"));
  const row = new BrowserElement("tr");
  row.children = cells;
  section.querySelectorAll = () => headers;
  body.querySelectorAll = () => [row];
  renderValidation({
    validation: {
      distributions: [
        {
          id: "ubuntu-noble",
          package_core: { status: "passed" },
          repository_integrity: "failed",
          provenance: { status: "passed" },
        },
      ],
    },
    container_validation: {
      distributions: [{ id: "ubuntu-noble", container_core: { status: "failed" } }],
    },
  });
  expect(body.innerHTML).toContain("Ubuntu 24.04 (noble)");
  expect(body.innerHTML).toContain("validation-icon pass");
  expect(body.innerHTML).toContain("validation-icon fail");
  expect(section.hidden).toBe(false);
  expect(headers[2].hidden).toBe(false);
  expect(cells[2].hidden).toBe(false);
});

test("hides container columns when only package validation exists", () => {
  const { get } = installBrowserDom({ ids: ["directory-validation", "directory-validation-rows"] });
  const section = get("directory-validation");
  const body = get("directory-validation-rows");
  const headers = Array.from({ length: 5 }, () => new BrowserElement("th"));
  const row = new BrowserElement("tr");
  row.children = Array.from({ length: 5 }, () => new BrowserElement("td"));
  section.querySelectorAll = () => headers;
  body.querySelectorAll = () => [row];
  renderValidation({ validation: { distributions: [{ id: "unknown-distro", label: "Other" }] } });
  expect(body.innerHTML).toContain("Other");
  expect(headers[2].hidden).toBe(true);
  expect(row.children[2].hidden).toBe(true);
});

test("uses fallback fields when validation table cells are absent", () => {
  const { get } = installBrowserDom({ ids: ["directory-validation", "directory-validation-rows"] });
  const section = get("directory-validation");
  const body = get("directory-validation-rows");
  section.querySelectorAll = () => [];
  body.querySelectorAll = () => [new BrowserElement("tr")];
  renderValidation({
    validation: {
      distributions: [
        {
          id: "custom",
          label: "Custom distribution",
          core: { status: "passed" },
          integrity: "passed",
          provenance_verification: "passed",
        },
      ],
    },
    container_validation: {
      distributions: [
        { id: "fallback", repository_integrity: "failed", provenance: { status: "failed" } },
      ],
    },
  });
  expect(body.innerHTML).toContain("Custom distribution");
  expect(body.innerHTML).toContain("fallback");
});
