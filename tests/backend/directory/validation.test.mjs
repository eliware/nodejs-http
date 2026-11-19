import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/directory/validation.mjs";
const { renderValidation } = __moduleApi0();

test("renders package and container checks without duplicate distributions", () => {
  const packageValidation = {
    distributions: [
      {
        id: "centos-stream-10",
        package_core: { status: "passed" },
        repository_integrity: { status: "failed" },
        provenance: "passed",
      },
      { id: "custom-id", label: "Custom <Linux>", core: { status: "failed" } },
    ],
  };
  const containerValidation = {
    distributions: [
      { id: "centos-stream-10", container_core: { status: "passed" } },
      { id: "almalinux-10", core: { status: "failed" }, provenance: { status: "passed" } },
    ],
  };
  const html = renderValidation(packageValidation, containerValidation);

  expect(html.match(/<tr>/g)).toHaveLength(4);
  expect(html).toContain("CentOS Stream 10");
  expect(html).toContain("Custom &lt;Linux&gt;");
  expect(html).toContain("Container core");
  expect(html).toContain("validation-pass");
  expect(renderValidation(null, { distributions: [{ id: "unmapped-id" }] })).toContain(
    "unmapped-id</th>",
  );
  expect(renderValidation(null, null)).toBe("");
  expect(
    renderValidation({ distributions: [{ id: "ubuntu-noble", integrity: "passed" }] }, null),
  ).toContain("Ubuntu 24.04 (noble)");
});
