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
  { name: "install", path: "/install", kind: "install" },
  { name: "package-browser", path: "/browse", kind: "browser" },
  { name: "stable-rpms", path: "/el10/x86_64/stable/", kind: "directory" },
  { name: "blog-index", path: "/blog", kind: "blog" },
  { name: "about", path: "/about", kind: "information" },
  { name: "terms", path: "/tos", kind: "information" },
  { name: "policy", path: "/policy", kind: "information" },
];

export default function browserConfig({ environment, platform, fileExists, userId }) {
  return {
    browserArgs: () => browserArgs(userId),
    chromePath: (puppeteer) => chromePath(puppeteer, environment, platform, fileExists),
    targetPages,
  };
}
