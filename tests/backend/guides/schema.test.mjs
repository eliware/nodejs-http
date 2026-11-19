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
  expect(validateGuide(guide)).toBe(guide);
  const debianGuide = { ...guide, platform: "debian" };
  expect(validateGuide(debianGuide)).toBe(debianGuide);
  const rollingGuide = { ...guide, channel: "rolling" };
  expect(validateGuide(rollingGuide)).toBe(rollingGuide);
});

test.each([
  null,
  { ...validGuide(), schemaVersion: 1 },
  { ...validGuide(), title: 1 },
  { ...validGuide(), summary: 1 },
  { ...validGuide(), platform: "unknown" },
  { ...validGuide(), channel: "unknown" },
  { ...validGuide(), source: null },
  { ...validGuide(), source: { upstream: "nodejs" } },
  { ...validGuide(), source: { repository: "repo" } },
  { ...validGuide(), sections: null },
  { ...validGuide(), sections: [null] },
  { ...validGuide(), sections: [{ title: 1, steps: [] }] },
  { ...validGuide(), sections: [{ title: "Install", steps: null }] },
  { ...validGuide(), sections: [{ title: "Install", steps: [null] }] },
  { ...validGuide(), sections: [{ title: "Install", steps: [{ title: 1 }] }] },
  { ...validGuide(), sections: [{ title: "Install", steps: [{ title: "Run", text: 1 }] }] },
  {
    ...validGuide(),
    sections: [{ title: "Install", steps: [{ title: "Run", text: "Run", commands: null }] }],
  },
  {
    ...validGuide(),
    sections: [{ title: "Install", steps: [{ title: "Run", text: "Run", commands: [1] }] }],
  },
  {
    ...validGuide(),
    sections: [
      { title: "Install", steps: [{ title: "Run", text: "Run", commands: [], verify: 1 }] },
    ],
  },
])("rejects invalid guide documents", (guide) => {
  expect(() => validateGuide(guide)).toThrow("invalid guide");
});
