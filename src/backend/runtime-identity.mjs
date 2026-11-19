import { hostname } from "node:os";

function hostIdFromHostname(name) {
  const value = String(name ?? "").trim();
  return value.split("-").at(-1) || value || "unknown";
}

function servingHostId() {
  return hostIdFromHostname(hostname());
}

export default function __moduleApi0() {
  return { hostIdFromHostname, servingHostId };
}
