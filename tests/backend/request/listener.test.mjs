import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import path from "node:path";
import { PassThrough } from "node:stream";
import __moduleApi0 from "../../../src/backend/request/listener.mjs";
const { createRequestListener } = __moduleApi0();
import __moduleApifix1 from "../../../src/backend/config.mjs";
const { loadConfig } = __moduleApifix1();
import { createRequestDirectory, publicFileStats } from "../../../test-fixtures/filesystem.mjs";

class Response extends PassThrough {
  constructor(request) {
    super();
    this.req = request;
    this.statusCode = 200;
    this.headers = {};
    this.finished = false;
  }

  setHeader(name, value) {
    this.headers[name] = value;
  }
  getHeader(name) {
    return this.headers[name];
  }
  writeHead(status, headers = {}) {
    this.statusCode = status;
    Object.assign(this.headers, headers);
  }
  end(body) {
    if (body !== undefined) this.write(body);
    this.finished = true;
    this.emit("finish");
    super.end();
  }
}

async function request(listener, method, url, headers = {}) {
  const req = { method, url, headers };
  const response = new Response(req);
  const chunks = [];
  response.on("data", (chunk) => chunks.push(chunk));
  await new Promise((resolve) => {
    response.on("finish", resolve);
    listener(req, response);
  });
  return { response, body: Buffer.concat(chunks).toString() };
}

describe("request listener", () => {
  let root;
  let config;
  let listener;

  beforeEach(async () => {
    root = await createRequestDirectory();
    config = loadConfig({
      PUBLIC_DIR: root,
      ACCESS_LOG: "false",
      COMPRESSION: "false",
    });
    listener = createRequestListener(config);
  });

  test("serves files, supports HEAD and byte ranges", async () => {
    expect((await request(listener, "GET", "/")).body).toBe("home");
    expect((await request(listener, "HEAD", "/file.txt")).response.statusCode).toBe(200);
    const ranged = await request(listener, "GET", "/file.txt", {
      range: "bytes=1-3",
    });
    expect(ranged.response.statusCode).toBe(206);
    expect(ranged.body).toBe("bcd");
  });

  test("handles method, malformed path, traversal, dotfile, and missing errors", async () => {
    expect((await request(listener, "POST", "/")).response.statusCode).toBe(405);
    expect((await request(listener, "GET", "/%E0%A4%A")).response.statusCode).toBe(400);
    expect((await request(listener, "GET", "/.env")).response.statusCode).toBe(404);
    expect((await request(listener, "GET", "/%2F..%2F..%2Fetc")).response.statusCode).toBe(400);
    expect((await request(listener, "GET", "/missing")).response.statusCode).toBe(404);
    expect(
      (await request(listener, "GET", "/file.txt", { range: "bytes=99-100" })).response.statusCode,
    ).toBe(416);
  });

  test("rejects dotfiles before dispatching special content routes", async () => {
    const published = jest.fn(async () => []);
    config.blogStore = { published };
    const result = await request(listener, "GET", "/blog/.hidden");
    expect(result.response.statusCode).toBe(404);
    expect(published).not.toHaveBeenCalled();
  });

  test("redirects directory requests and lists directories without an index", async () => {
    const redirect = await request(listener, "GET", "/dir");
    expect(redirect.response.statusCode).toBe(301);
    const listed = await request(listener, "GET", "/dir/");
    expect(listed.response.statusCode).toBe(200);
  });

  test("serves a cached file body without opening a stream", async () => {
    const file = path.join(root, "file.txt");
    const { stats } = await publicFileStats(root, "file.txt");
    config.ramCacheStore = new Map([[file, { stats, body: Buffer.from("cached") }]]);
    const result = await request(listener, "GET", "/file.txt");
    expect(result.response.statusCode).toBe(200);
    expect(result.body).toBe("cached");
  });

  test("disables byte ranges when configured", async () => {
    config.byteRanges = false;
    listener = createRequestListener(config);
    const result = await request(listener, "GET", "/file.txt", {
      range: "bytes=1-3",
    });
    expect(result.response.statusCode).toBe(200);
  });

  test("creates a text logger and disables both allowed methods", async () => {
    config.structuredLogs = false;
    config.allowGet = false;
    config.allowHead = false;
    config.accessLog = false;
    listener = createRequestListener(config);
    expect((await request(listener, "GET", "/file.txt")).response.statusCode).toBe(405);
  });
});
