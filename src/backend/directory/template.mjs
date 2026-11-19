function renderDirectoryTemplate(template, values) {
  return template
    .replaceAll("{{TITLE}}", values.title)
    .replaceAll("{{OG_IMAGE}}", values.ogImage)
    .replaceAll("{{OG_DESCRIPTION}}", values.ogDescription)
    .replaceAll("{{ROWS}}", values.rows)
    .replaceAll("{{BREADCRUMBS}}", values.breadcrumbs)
    .replaceAll("{{PATH}}", values.path)
    .replaceAll("{{VALIDATION}}", values.validation)
    .replaceAll("{{SUMMARY}}", values.summary)
    .replaceAll("__COPYRIGHT_YEAR__", values.copyrightYear)
    .replaceAll("__APP_VERSION__", values.appVersion)
    .replaceAll("__HOST_ID__", values.hostId)
    .replaceAll("__ASSET_VERSION__", values.assetVersion);
}

export default function __moduleApi0() {
  return { renderDirectoryTemplate };
}
