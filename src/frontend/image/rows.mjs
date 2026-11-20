import folderRowApi from "./rows/folder.mjs";
const { renderFolderRow } = folderRowApi();
import imageRowApi from "./rows/image.mjs";
const { renderImageRow } = imageRowApi();

export default function __moduleApi0() {
  return { renderFolderRow, renderImageRow };
}
