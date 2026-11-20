const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

function formatBlogDate(value) {
  return dateFormatter.format(new Date(value));
}

export default function __moduleApi0() {
  return { formatBlogDate };
}
