function buildInstallCommands({ packageManager, upgrading, origin, repositoryFile }) {
  const lines = upgrading
    ? [`sudo ${packageManager} update -y eliware-node26`]
    : [
        `sudo curl -fsSLo /etc/yum.repos.d/nodejs26.repo ${origin}${repositoryFile}`,
        `sudo ${packageManager} install -y eliware-node26`,
        "node --version && npm --version",
      ];
  return lines.join("\n");
}

export default function __moduleApi0() {
  return { buildInstallCommands };
}
