import customErrorApi from "./custom-error.mjs";
const { sendCustomError } = customErrorApi();

function createErrorSender(sendText) {
  return async function sendError(
    response,
    statusCode,
    message,
    config,
    customFile = "",
    headers = {},
  ) {
    if (await sendCustomError(response, statusCode, config, customFile, headers)) return;
    await sendText(response, statusCode, message, config, headers);
  };
}

export default function __moduleApi0() {
  return { createErrorSender };
}
