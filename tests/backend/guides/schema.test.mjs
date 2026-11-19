import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../src/backend/guides/schema.mjs";
const { validateGuide } = __moduleApi0();

const validGuide = () => ({
  schemaVersion: 2,
  title: "Install Node.js",
  summary: "Install summary",
  platform: "rpm",
  channel: "stable",
  source: { repository: "repo", upstream: "nodejs" },
  sections: [
    {
      title: "Install",
      steps: [{ title: "Run", text: "Run it", commands: ["dnf"], verify: "Done" }],
    },
  ],
});

test("accepts a valid guide document", () => {
  const guide = validGuide();
  expect(validateGuide(guide, "centos10", "stable")).toBe(guide);
});

test.each([
  [null, "centos10", "stable"],
  [{ ...validGuide(), schemaVersion: 1 }, "centos10", "stable"],
  [{ ...validGuide(), title: 1 }, "centos10", "stable"],
  [{ ...validGuide(), summary: 1 }, "centos10", "stable"],
  [{ ...validGuide(), platform: "unknown" }, "centos10", "stable"],
  [validGuide(), "debian12", "stable"],
  [{ ...validGuide(), channel: "unknown" }, "centos10", "stable"],
  [validGuide(), "centos10", "rolling"],
  [{ ...validGuide(), source: null }, "centos10", "stable"],
  [{ ...validGuide(), source: { upstream: "nodejs" } }, "centos10", "stable"],
  [{ ...validGuide(), source: { repository: "repo" } }, "centos10", "stable"],
  [{ ...validGuide(), sections: null }, "centos10", "stable"],
  [{ ...validGuide(), sections: [null] }, "centos10", "stable"],
  [{ ...validGuide(), sections: [{ title: 1, steps: [] }] }, "centos10", "stable"],
  [{ ...validGuide(), sections: [{ title: "Install", steps: null }] }, "centos10", "stable"],
  [{ ...validGuide(), sections: [{ title: "Install", steps: [null] }] }, "centos10", "stable"],
  [
    { ...validGuide(), sections: [{ title: "Install", steps: [{ title: 1 }] }] },
    "centos10",
    "stable",
  ],
  [
    { ...validGuide(), sections: [{ title: "Install", steps: [{ title: "Run", text: 1 }] }] },
    "centos10",
    "stable",
  ],
  [
    {
      ...validGuide(),
      sections: [{ title: "Install", steps: [{ title: "Run", text: "Run", commands: null }] }],
    },
    "centos10",
    "stable",
  ],
  [
    {
      ...validGuide(),
      sections: [{ title: "Install", steps: [{ title: "Run", text: "Run", commands: [1] }] }],
    },
    "centos10",
    "stable",
  ],
  [
    {
      ...validGuide(),
      sections: [
        { title: "Install", steps: [{ title: "Run", text: "Run", commands: [], verify: 1 }] },
      ],
    },
    "centos10",
    "stable",
  ],
  [validGuide(), "other", "stable"],
])("rejects invalid guide documents", (guide, os, channel) => {
  expect(() => validateGuide(guide, os, channel)).toThrow("invalid guide");
});
