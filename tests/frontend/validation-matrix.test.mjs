import { expect, jest, test } from "@jest/globals";
import { installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

const fetchCatalog = jest.fn();
jest.unstable_mockModule("../../src/frontend/api.mjs", () => ({
  default: () => ({ fetchCatalog }),
}));
const { initValidationMatrix } = (
  await import("../../src/frontend/validation-matrix.mjs")
).default();

test("does nothing when the matrix body is missing", async () => {
  installBrowserDom();
  await initValidationMatrix();
  expect(fetchCatalog).not.toHaveBeenCalled();
});

test("renders validation statuses and uses distribution aliases", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  fetchCatalog.mockResolvedValue({
    stable: {
      validation: {
        generated: "2026-01-01T00:00:00Z",
        distributions: [
          {
            id: "debian",
            core: { status: "passed" },
            integrity: "failed",
            provenance_verification: "passed",
          },
        ],
      },
      container_validation: {
        distributions: [
          { id: "ubuntu", core: { status: "passed" }, provenance: { status: "failed" } },
        ],
      },
    },
    images: [
      {
        container_validation: {
          distributions: [{ id: "rocky-10", container_core: { status: "passed" } }],
        },
      },
    ],
  });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("Debian 12 (bookworm)");
  expect(get("validation-rows").innerHTML).toContain("Ubuntu 24.04 (noble)");
  expect(get("validation-rows").innerHTML).toContain("validation-icon pass");
  expect(get("validation-rows").innerHTML).toContain("validation-icon fail");
  expect(get("validation-checks").textContent).toContain("Results from");
});

test("shows the fallback row when metadata cannot load", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  fetchCatalog.mockRejectedValue(new Error("offline"));
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("temporarily unavailable");
});

test("uses package, repository, and provenance fallbacks", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  fetchCatalog.mockResolvedValue({
    stable: {
      validation: {
        generated: "2026-01-01T00:00:00Z",
        distributions: [
          {
            id: "centos-stream-10",
            package_core: { status: "passed" },
            repository_integrity: "passed",
            provenance: "passed",
          },
          {
            id: "rocky-10",
            core: { status: "failed" },
            integrity: "failed",
            provenance_verification: "failed",
          },
          { id: "oracle-linux-10" },
        ],
        repository_integrity: "passed",
        provenance_verification: "passed",
      },
      container_validation: { generated: "2026-01-02T00:00:00Z", distributions: [] },
    },
    images: [
      {
        container_validation: {
          distributions: [
            { id: "almalinux-10", repository_integrity: "passed", provenance: "passed" },
          ],
        },
      },
      { container_validation: {} },
    ],
  });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("validation-icon skip");
  expect(get("validation-checks").textContent).toContain("Results from");
});

test("uses container metadata dates when package metadata is missing", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  fetchCatalog.mockResolvedValue({
    stable: {
      container_validation: {
        generated: "2026-02-01T00:00:00Z",
        distributions: [
          {
            id: "centos-stream-10",
            core: { status: "passed" },
            repository_integrity: "passed",
            provenance_verification: "passed",
          },
        ],
      },
    },
  });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("validation-icon pass");
});

test("renders valid metadata without the optional check summary", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows"] });
  fetchCatalog.mockResolvedValue({ stable: { validation: { generated: "2026-01-01" } } });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("CentOS Stream 10");
});
