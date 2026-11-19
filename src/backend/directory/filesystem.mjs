import path from "node:path";
import { promises as fs } from "node:fs";
import __moduleApi1 from "../path-utils.mjs";
const { resolvePublicPath } = __moduleApi1();
import __moduleApifix1 from "./metadata.mjs";
const { readJson } = __moduleApifix1();

function encodePath(pathname) {
  return pathname
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function readFilesystemDirectory(config, requestPath, filesystem = fs) {
  const filePath =
    requestPath === "/"
      ? path.resolve(config.publicDir)
      : resolvePublicPath(config.publicDir, requestPath);
  if (!filePath) return null;
  const publicRoot = await filesystem.realpath(config.publicDir);
  const resolvedPath = await filesystem.realpath(filePath);
  const normalizedRoot = path.resolve(publicRoot);
  if (resolvedPath !== normalizedRoot && !resolvedPath.startsWith(`${normalizedRoot}${path.sep}`))
    return null;
  const stats = await filesystem.stat(resolvedPath);
  if (!stats.isDirectory()) return null;
  const directoryHref = requestPath.endsWith("/") ? requestPath : `${requestPath}/`;
  const encodedDirectoryHref = encodePath(directoryHref);
  const entries = (
    await Promise.all(
      (await filesystem.readdir(resolvedPath, { withFileTypes: true }))
        .filter((entry) => config.allowDotfiles || !entry.name.startsWith("."))
        .map(async (entry) => {
          let isDirectory = entry.isDirectory();
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
              isDirectory = (await filesystem.stat(targetPath)).isDirectory();
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
  return {
    entries,
    validation: await readJson(resolvedPath, "validation.json", filesystem),
    container_validation: await readJson(resolvedPath, "container-validation.json", filesystem),
  };
}

export default function __moduleApi0() {
  return { readFilesystemDirectory };
}
