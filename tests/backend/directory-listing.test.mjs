import { expect, test } from "@jest/globals";
import { PassThrough } from "node:stream";
import __moduleApi0 from "../../src/backend/directory-listing.mjs";
const { sendDirectoryListing } = __moduleApi0();
import { createDirectoryListingFixture } from "../../test-fixtures/filesystem.mjs";

function response(method = "GET", headers = {}) {
  const value = new PassThrough();
  value.req = { method, headers };
  value.headers = {};
  value.writeHead = (status, fields) => {
    value.statusCode = status;
    value.headers = fields;
  };
  return value;
}

async function bodyOf(output) {
  const chunks = [];
  output.on("data", (chunk) => chunks.push(chunk));
  const ended = new Promise((resolve) => output.on("end", resolve));
  await ended;
  return Buffer.concat(chunks).toString();
}

test("renders the configured directory template with file and directory rows", async () => {
  const { publicDir, directoryTemplate } = await createDirectoryListingFixture();
  const output = response();
  const bodyPromise = bodyOf(output);
  await sendDirectoryListing(output, output.req, publicDir, "/metadata/runs/run-1/", {
    allowDotfiles: false,
    directoryTemplate,
    securityHeaders: true,
    compression: false,
    compressionMinBytes: 1000,
  });
  const body = await bodyPromise;
  expect(output.statusCode).toBe(200);
  expect(body).toContain("Index of /metadata/runs/run-1/");
  expect(body).toContain("Parent directory");
  expect(body).toContain("hello.txt");
  expect(body).toContain("folder/");
  expect(body).not.toContain("secret");
  expect(body).toContain("Total files: 4");
  expect(output.headers["Content-Type"]).toContain("text/html");
});

test("uses built-in HTML on a missing template and permits dotfiles by config", async () => {
  const { publicDir } = await createDirectoryListingFixture();
  const output = response();
  const bodyPromise = bodyOf(output);
  await sendDirectoryListing(output, output.req, publicDir, "/", {
    allowDotfiles: true,
    directoryTemplate: `${publicDir}/missing.html`,
    securityHeaders: false,
    compression: false,
  });
  const body = await bodyPromise;
  expect(body).toContain(".hidden");
  expect(body).toContain("<table>");
  expect(body).not.toContain("Parent directory");
  expect(output.headers["X-Content-Type-Options"]).toBeUndefined();
});

test("does not send a body for HEAD and compresses accepted HTML", async () => {
  const { publicDir, directoryTemplate } = await createDirectoryListingFixture();
  const head = response("HEAD");
  await sendDirectoryListing(head, head.req, publicDir, "/", {
    directoryTemplate,
    allowDotfiles: false,
    compression: false,
  });
  expect(head.statusCode).toBe(200);
  const compressed = response("GET", { "accept-encoding": "gzip" });
  const bodyPromise = bodyOf(compressed);
  await sendDirectoryListing(compressed, compressed.req, publicDir, "/", {
    directoryTemplate,
    allowDotfiles: false,
    compression: true,
    compressionMinBytes: 0,
  });
  expect((await bodyPromise).length).toBeGreaterThan(0);
  expect(compressed.headers["Content-Encoding"]).toBe("gzip");
});
