function copyrightYear() {
  const year = new Date().getUTCFullYear();
  return year <= 2026 ? "2026" : `2026-${year}`;
}

export default function __moduleApi0() {
  return { copyrightYear };
}
