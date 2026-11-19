import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/frontend/image/browser/state.mjs";
const {
  createImageBrowserState,
  selectedImageRecords,
  resetImageSelection,
  setOpenRepository,
  setCurrentExample,
  setImageExampleReferenceMode,
  setImageExampleKind,
} = __moduleApi0();

const records = [
  { distro: "centos-stream", channel: "stable", version: "26.13.1" },
  { distro: "centos-stream", channel: "preview", candidate: "rolling-abc" },
];

test("tracks selection, navigation, and image example state", () => {
  const state = createImageBrowserState({ stable: { version: "26.13.1" } }, records);
  expect(selectedImageRecords(state, "centos-stream", "stable", "stable")).toEqual([records[0]]);
  expect(selectedImageRecords(state, "centos-stream", "preview", "rolling-abc")).toEqual([
    records[1],
  ]);
  setOpenRepository(state, "ghcr.io/eliware/nodejs");
  setCurrentExample(state, records[0], "dockerfile");
  setImageExampleReferenceMode(state, "sha");
  expect(setImageExampleKind(state, "compose")).toBe(true);
  expect(state).toMatchObject({
    openRepository: "ghcr.io/eliware/nodejs",
    currentExample: { kind: "compose" },
    exampleReferenceMode: "sha",
  });
  resetImageSelection(state);
  expect(state.openRepository).toBeNull();
  expect(state.currentExample).toBeNull();
  expect(setImageExampleKind(state, "compose")).toBe(false);
});
