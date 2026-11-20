function renderFolderRow(list, repository, getCount, onOpen) {
  const article = document.createElement("article");
  article.className = "image-entry image-folder";
  const button = document.createElement("button");
  button.className = "image-folder-button";
  button.type = "button";
  button.innerHTML = '<span class="glyph" aria-hidden="true">📁</span>';
  const content = document.createElement("span");
  const title = document.createElement("strong");
  title.textContent = `${repository.split("/").at(-1)}/`;
  const countLabel = document.createElement("span");
  countLabel.className = "muted small";
  countLabel.textContent = `${getCount()} images`;
  content.append(title, countLabel);
  button.append(content);
  button.addEventListener("click", () => onOpen(repository));
  article.appendChild(button);
  list.appendChild(article);
}

export default function __moduleApi0() {
  return { renderFolderRow };
}
