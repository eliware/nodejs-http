import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import path from "node:path";
import { PassThrough } from "node:stream";
import __moduleApi0 from "../../src/backend/request-listener.mjs";
const { createRequestListener } = __moduleApi0();
import __moduleApifix1 from "../../src/backend/config.mjs";
const { loadConfig } = __moduleApifix1();
import { createRequestDirectory, publicFileStats } from "../../test-fixtures/filesystem.mjs";

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

  test("replaces unsafe request IDs before writing headers or logs", async () => {
    config.accessLog = true;
    const info = jest.fn();
    listener = createRequestListener(config, { info });
    const unsafe = await request(listener, "GET", "/file.txt", {
      "x-request-id": "bad\r\nInjected: value",
    });
    const oversized = await request(listener, "GET", "/file.txt", {
      "x-request-id": "x".repeat(129),
    });
    const trusted = await request(listener, "GET", "/file.txt", {
      "x-request-id": "trusted-123",
    });
    for (const result of [unsafe, oversized]) {
      const requestId = result.response.headers["X-Request-ID"];
      expect(requestId).toMatch(/^[0-9a-f-]{36}$/);
    }
    expect(trusted.response.headers["X-Request-ID"]).toBe("trusted-123");
    const loggedIds = info.mock.calls.map(([, record]) => record.request_id);
    expect(loggedIds).toEqual([
      unsafe.response.headers["X-Request-ID"],
      oversized.response.headers["X-Request-ID"],
      "trusted-123",
    ]);
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

  test("supports unstructured access logs and disabling byte ranges", async () => {
    const log = jest.fn();
    config.structuredLogs = false;
    config.accessLog = true;
    config.byteRanges = false;
    listener = createRequestListener(config, { info: log });
    const result = await request(listener, "GET", "/file.txt", {
      range: "bytes=1-3",
    });
    expect(result.response.statusCode).toBe(200);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toContain("GET /file.txt");
  });

  test("creates a text logger and disables both allowed methods", async () => {
    config.structuredLogs = false;
    config.allowGet = false;
    config.allowHead = false;
    config.accessLog = false;
    listener = createRequestListener(config);
    expect((await request(listener, "GET", "/file.txt")).response.statusCode).toBe(405);
  });

  test("logs structured requests when method and URL are missing", async () => {
    const info = jest.fn();
    config.structuredLogs = true;
    config.accessLog = true;
    listener = createRequestListener(config, { info });
    const req = { headers: {} };
    const response = new Response(req);
    await new Promise((resolve) => {
      response.once("finish", resolve);
      listener(req, response);
    });
    expect(info).toHaveBeenCalledWith(
      "HTTP request",
      expect.objectContaining({ method: "-", path: "/" }),
    );
  });
});
