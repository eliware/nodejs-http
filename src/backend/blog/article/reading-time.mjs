function readingTimeMinutes(content) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 220));
}

export default function __moduleApi0() {
  return { readingTimeMinutes };
}
