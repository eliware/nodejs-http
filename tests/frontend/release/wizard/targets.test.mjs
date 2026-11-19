import { expect, test } from "@jest/globals";
import {
  distroImages,
  distroRepositories,
  distroTargets,
} from "../../../../src/frontend/release/wizard/targets.mjs";

test("supports the CentOS Stream 10 Node.js image and repository", () => {
  expect(distroImages).toEqual({
    "centos-stream": "ghcr.io/eliware/centos10-node26",
  });
  expect(distroTargets["centos-stream"]).toEqual({
    label: "CentOS Stream",
    release: "10",
    family: "rpm",
    repository: "/el10/x86_64",
    repoFile: "/nodejs26.repo",
  });
  expect(distroRepositories["centos-stream"].packages).toEqual([
    "dnf-plugins-core",
    "epel-release",
  ]);
});
