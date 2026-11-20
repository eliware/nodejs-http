import path from "node:path";

function encodePath(pathname) {
  return pathname
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function readDirectoryEntries(filesystem, resolvedPath, normalizedRoot, requestPath, config) {
  const directoryHref = requestPath.endsWith("/") ? requestPath : `${requestPath}/`;
  const encodedDirectoryHref = encodePath(directoryHref);
  return (
    await Promise.all(
      (await filesystem.readdir(resolvedPath, { withFileTypes: true }))
        .filter((entry) => config.allowDotfiles || !entry.name.startsWith("."))
        .map(async (entry) => {
          let isDirectory = entry.isDirectory();
          if (!isDirectory && !entry.isFile() && !entry.isSymbolicLink?.()) return null;
          if (entry.isSymbolicLink?.()) {
            if (!config.allowSymlinks) return null;
            try {
              const targetPath = await filesystem.realpath(path.join(resolvedPath, entry.name));
              const relativeTarget = path.relative(normalizedRoot, targetPath);
              if (
                relativeTarget === ".." ||
                relativeTarget.startsWith(`..${path.sep}`) ||
                path.isAbsolute(relativeTarget)
              )
                return null;
              const targetStats = await filesystem.stat(targetPath);
              isDirectory = targetStats.isDirectory();
              if (!isDirectory && !targetStats.isFile()) return null;
            } catch {
              return null;
            }
          }
          return {
            name: entry.name,
            type: isDirectory ? "directory" : "file",
            href: `${encodedDirectoryHref}${encodeURIComponent(entry.name)}${isDirectory ? "/" : ""}`,
          };
        }),
    )
  ).filter(Boolean);
}

export default function __moduleApi0() {
  return { readDirectoryEntries };
}
