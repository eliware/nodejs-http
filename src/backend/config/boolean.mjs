const TRUE = new Set(["1", "true", "yes", "on"]);
const FALSE = new Set(["0", "false", "no", "off"]);

function parseBoolean(value, fallback) {
  if (TRUE.has(String(value).toLowerCase())) return true;
  if (FALSE.has(String(value).toLowerCase())) return false;
  return fallback;
}

export default function __moduleApi0() {
  return { parseBoolean };
}
