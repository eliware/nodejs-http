async function requestBlogJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`blog request failed: ${response.status}`);
  return response.json();
}

export default function __moduleApi0() {
  return { requestBlogJson };
}
