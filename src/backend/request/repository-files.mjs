import __moduleApi1 from "../file-access.mjs";
const { fileExists } = __moduleApi1();
import __moduleApifix1 from "../path-utils.mjs";
const { resolvePublicPath } = __moduleApifix1();
import __moduleApifix2 from "../directory/request.mjs";
const { resolveDirectoryRequest } = __moduleApifix2();

async function resolveRepositoryFile(request, response, requestPath, config) {
  const filePath = resolvePublicPath(config.publicDir, requestPath);
  if (!filePath) return { handled: false, file: null };
  let file = await fileExists(filePath, config);
  if (!file && config.directoryIndex) {
    const directoryResult = await resolveDirectoryRequest(
      request,
      response,
      filePath,
      requestPath,
      config,
    );
    if (directoryResult.handled) return directoryResult;
    file = directoryResult.file;
  }
  return { handled: false, file };
}

export default function __moduleApi0() {
  return { resolveRepositoryFile };
}
