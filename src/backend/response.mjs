import __moduleApifix2 from "./response/headers.mjs";
const { baseHeaders } = __moduleApifix2();
import __moduleApifix3 from "./response/errors.mjs";
const { createErrorSender } = __moduleApifix3();
import __moduleApifixText from "./response/text.mjs";
const { sendText } = __moduleApifixText();
import __moduleApifixJson from "./response/json.mjs";
const { sendJson } = __moduleApifixJson();

const sendError = createErrorSender(sendText);

export default function __moduleApi0() {
  return { baseHeaders, sendText, sendError, sendJson };
}
