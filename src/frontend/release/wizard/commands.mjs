import packageCommandsApi from "./package-commands.mjs";
const packageCommands = packageCommandsApi();
import imageCommandsApi from "./image-commands.mjs";
const imageCommands = imageCommandsApi();

export default function createCommands() {
  return { ...packageCommands, ...imageCommands };
}
