import { expect, test } from "@jest/globals";
import __moduleApi0 from "../../../../src/frontend/release/wizard/images.mjs";
const { resolveContainerImage } = __moduleApi0();

const catalog = {
  stable: { latest: { node_version: "26.13.1" } },
  preview: { items: [{ candidate: "rolling-abcdef1234" }] },
  images: [
    {
      image: {
        repository: "ghcr.io/eliware/centos10-node26",
        tag: "26.13.1",
        reference: "ghcr.io/eliware/centos10-node26:26.13.1",
        digest: "sha256:node26",
      },
      channel: "stable",
      version: "26.13.1",
    },
  ],
};

test("resolves a published Node.js base image digest", () => {
  expect(resolveContainerImage(catalog, "centos-stream", "stable", "stable", "sha")).toEqual({
    reference: "ghcr.io/eliware/centos10-node26@sha256:node26",
    digest: "sha256:node26",
    repositoryUrl: "https://ghcr.io/eliware/centos10-node26",
  });
});

test("finds an image for an explicit stable Node.js version", () => {
  expect(resolveContainerImage(catalog, "centos-stream", "stable", "26.13.1", "sha")).toEqual({
    reference: "ghcr.io/eliware/centos10-node26@sha256:node26",
    digest: "sha256:node26",
    repositoryUrl: "https://ghcr.io/eliware/centos10-node26",
  });
});

test("resolves preview and version fallback image records", () => {
  const records = {
    stable: { version: "26.13.1", image: { digest: "sha256:stable" } },
    preview: { items: [{ candidate: "rolling-abcdef1234" }] },
    images: [
      {
        image: { repository: "ghcr.io/eliware/centos10-node26", digest: "sha256:preview" },
        channel: "preview",
        candidate: "rolling-abcdef1234",
      },
      {
        image: { repository: "ghcr.io/eliware/centos10-node26", digest: "sha256:stable" },
        channel: "stable",
        version: "26.13.1",
      },
    ],
  };
  expect(
    resolveContainerImage(records, "centos-stream", "preview", "rolling-abcdef1234", "sha").digest,
  ).toBe("sha256:preview");
  expect(resolveContainerImage(records, "centos-stream", "stable", "stable", "sha").digest).toBe(
    "sha256:stable",
  );
});

test("resolves preview tags when image metadata is missing", () => {
  const preview = resolveContainerImage(
    catalog,
    "centos-stream",
    "preview",
    "rolling-abcdef1234",
    "tag",
  );
  expect(preview.reference).toBe("ghcr.io/eliware/centos10-node26:rolling-abcdef1234");
  expect(preview.digest).toBe("Not published yet");
});

test("uses the stable image and safe fallbacks", () => {
  const image = resolveContainerImage(catalog, "centos-stream", "stable", "stable", "tag");
  expect(image.reference).toBe("ghcr.io/eliware/centos10-node26:26.13.1");
  expect(image.repositoryUrl).toBe("https://ghcr.io/eliware/centos10-node26");
  const fallback = resolveContainerImage({ images: [{}] }, "unknown", "stable", "stable", "sha");
  expect(fallback.reference).toBe("ghcr.io/eliware/centos10-node26");
  expect(fallback.repositoryUrl).toBeNull();
  expect(fallback.digest).toBe("Not published yet");
});

test("normalizes a direct image catalog record without a reference", () => {
  const direct = resolveContainerImage(
    {
      stable: { latest: { node_version: "26.13.1" } },
      images: [
        {
          repository: "ghcr.io/eliware/centos10-node26",
          node_version: "26.13.1",
          tag: "26.13.1",
          digest: "sha256:direct",
        },
      ],
    },
    "centos-stream",
    "stable",
    "stable",
    "tag",
  );
  expect(direct.reference).toBe("ghcr.io/eliware/centos10-node26:26.13.1");
  expect(direct.digest).toBe("sha256:direct");
});
