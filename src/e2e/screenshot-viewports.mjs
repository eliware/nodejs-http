function screenshotViewports(iphone12) {
  return [
    { name: "desktop-1080p", viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 } },
    { name: "desktop-1440p", viewport: { width: 2560, height: 1440, deviceScaleFactor: 1 } },
    { name: "desktop-2160p", viewport: { width: 3840, height: 2160, deviceScaleFactor: 1 } },
    { name: "iphone-12-portrait", viewport: iphone12.viewport },
    {
      name: "iphone-12-landscape",
      viewport: {
        ...iphone12.viewport,
        width: iphone12.viewport.height,
        height: iphone12.viewport.width,
        isLandscape: true,
      },
    },
  ];
}

export default function __moduleApi0() {
  return { screenshotViewports };
}
