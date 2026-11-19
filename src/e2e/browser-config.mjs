function browserArgs(userId) {
  return userId === 0 ? ["--no-sandbox", "--disable-dev-shm-usage"] : ["--disable-dev-shm-usage"];
}

async function chromePath(puppeteer, environment, platform, fileExists) {
  if (environment.CHROME_PATH) return environment.CHROME_PATH;
  const systemChrome = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
  ].find((candidate) => platform === "linux" && fileExists(candidate));
  return systemChrome ?? (await puppeteer.executablePath());
}

const targetPages = [
  { name: "homepage", path: "/" },
  { name: "directory-index", path: "/el10/x86_64/" },
  { name: "directory-11-2", path: "/el10/x86_64/11.2/" },
  { name: "blog-index", path: "/blog", kind: "blog" },
  {
    name: "blog-article",
    path: "/blog/glusterfs-el10-first-replica-volume",
    kind: "blog",
  },
];

export default function browserConfig({ environment, platform, fileExists, userId }) {
  return {
    browserArgs: () => browserArgs(userId),
    chromePath: (puppeteer) => chromePath(puppeteer, environment, platform, fileExists),
    targetPages,
  };
}
