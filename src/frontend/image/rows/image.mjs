function renderImageRow(list, record, showExample, formatDateTime, displaySource) {
  const article = document.createElement("article");
  article.className = "image-entry image-entry-selectable";
  article.title = "Show configuration examples for this image";
  const heading = document.createElement("div");
  heading.className = "image-entry-heading";
  const title = document.createElement("h3");
  title.textContent = `Stable · Node.js ${record.version}`;
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = `${record.distroLabel} ${record.release} · ${record.arch}`;
  heading.append(title, badge);
  const details = document.createElement("p");
  details.className = "muted small";
  details.textContent = `Built ${formatDateTime(record.built || record.generated)} · Source ${displaySource(record)}`;
  const reference = document.createElement("code");
  reference.textContent = record.image.reference;
  const digest = document.createElement("code");
  digest.textContent = record.image.digest;
  const refs = document.createElement("div");
  refs.className = "image-entry-references";
  refs.append(reference, digest);
  article.addEventListener("click", () => showExample(record, "dockerfile"));
  article.append(heading, details, refs);
  list.appendChild(article);
}

export default function __moduleApi0() {
  return { renderImageRow };
}
