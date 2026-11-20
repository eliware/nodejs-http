import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/frontend/release/wizard/install-commands.mjs";
const { buildInstallCommands } = __moduleApi0();

test("builds DNF installation commands", () => {
  expect(
    buildInstallCommands({
      packageManager: "dnf",
      upgrading: false,
      origin: "https://repo.example",
      repositoryFile: "/nodejs26.repo",
    }),
  ).toBe(
    "sudo curl -fsSLo /etc/yum.repos.d/nodejs26.repo https://repo.example/nodejs26.repo\nsudo dnf install -y eliware-node26\nnode --version && npm --version",
  );
});

test("builds YUM update commands", () => {
  expect(
    buildInstallCommands({
      packageManager: "yum",
      upgrading: true,
      origin: "",
      repositoryFile: "",
    }),
  ).toBe("sudo yum update -y eliware-node26");
});
