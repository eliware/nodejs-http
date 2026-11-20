function createHeadingIdGenerator() {
  const headingIds = new Map();
  return (value) => {
    const base =
      String(value)
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "section";
    const count = headingIds.get(base) || 0;
    headingIds.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };
}

export default function __moduleApi0() {
  return { createHeadingIdGenerator };
}
