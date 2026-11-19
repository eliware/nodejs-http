import { expect, jest, test } from "@jest/globals";
import { installBrowserDom } from "../../test-fixtures/browser-dom.mjs";

const fetchCatalog = jest.fn();
const fetchReleaseManifest = jest.fn();
jest.unstable_mockModule("../../src/frontend/api.mjs", () => ({
  default: () => ({ fetchCatalog, fetchReleaseManifest }),
}));
const { initValidationMatrix } = (
  await import("../../src/frontend/validation-matrix.mjs")
).default();

const catalog = {
  active_generation: "generation-1",
  generated: "2026-01-01T00:00:00Z",
  stable: {
    latest: {
      validation: { status: "passed" },
      provenance_path: "metadata/provenance/package.json",
    },
  },
  images: [
    {
      validation: "passed",
      provenance_path: "metadata/provenance/images/image.json",
      generated: "2026-01-02T00:00:00Z",
    },
  ],
};
const manifest = {
  generation_id: "generation-1",
  signed: true,
  publication_ready: true,
  files: [
    { path: "metadata/provenance/package.json" },
    { path: "metadata/provenance/package.json.asc" },
    { path: "metadata/provenance/images/image.json" },
    { path: "metadata/provenance/images/image.json.asc" },
  ],
};

function setMetadata({ packageStatus = "passed", imageStatus = "passed" } = {}) {
  fetchCatalog.mockResolvedValue({
    ...catalog,
    stable: {
      ...catalog.stable,
      latest: {
        ...catalog.stable.latest,
        validation: { status: packageStatus },
      },
    },
    images: [{ ...catalog.images[0], validation: imageStatus }],
  });
  fetchReleaseManifest.mockResolvedValue(manifest);
}

test("does nothing when the matrix body is missing", async () => {
  installBrowserDom();
  await initValidationMatrix();
  expect(fetchCatalog).not.toHaveBeenCalled();
});

test("renders passing checks from the published catalog and manifest", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  setMetadata();
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("CentOS Stream 10");
  expect(get("validation-rows").innerHTML.match(/validation-icon pass/g)).toHaveLength(4);
  expect(get("validation-checks").textContent).toContain("Results from");
});

test("shows failed package and image validation statuses", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  setMetadata({ packageStatus: "failed", imageStatus: "failed" });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML.match(/validation-icon fail/g)).toHaveLength(2);
});

test("shows a fallback row when metadata cannot load", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  fetchCatalog.mockRejectedValue(new Error("offline"));
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("temporarily unavailable");
});

test("marks provenance as failed when signatures are missing", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  setMetadata();
  fetchReleaseManifest.mockResolvedValue({ ...manifest, files: [] });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("validation-icon fail");
});

test("marks the repository as failed when its manifest generation is stale", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  setMetadata();
  fetchReleaseManifest.mockResolvedValue({ ...manifest, generation_id: "old-generation" });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("validation-icon fail");
});

test("handles optional manifest files and validation timestamps", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows", "validation-checks"] });
  setMetadata();
  fetchCatalog.mockResolvedValue({
    ...catalog,
    generated: undefined,
    images: [{ ...catalog.images[0], generated: undefined }],
  });
  fetchReleaseManifest.mockResolvedValue({ ...manifest, files: undefined });
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("validation-icon fail");
  expect(get("validation-checks").textContent).toContain("Results from");
});

test("renders the matrix without an optional summary element", async () => {
  const { get } = installBrowserDom({ ids: ["validation-rows"] });
  setMetadata();
  await initValidationMatrix();
  expect(get("validation-rows").innerHTML).toContain("validation-icon pass");
});
