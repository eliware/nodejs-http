import { expect, test } from "@jest/globals";
import { once } from "node:events";
import Fastify from "fastify";
import __moduleApi0 from "../../src/backend/http.mjs";
const { registerWebRoutes } = __moduleApi0();
import { fixture, MockResponse, request } from "../../test-fixtures/blog/http.mjs";

function requestListener(_request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("site response");
}

test("forwards the home route to the web request handler", async () => {
  const server = Fastify({ logger: false });
  registerWebRoutes(server, { requestListener });
  const response = await server.inject({ method: "GET", url: "/" });
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("site response");
  await server.close();
});

test("forwards nested asset routes to the web request handler", async () => {
  const server = Fastify({ logger: false });
  registerWebRoutes(server, { requestListener });
  const response = await server.inject({ method: "GET", url: "/assets/gluster-logo.webp" });
  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("site response");
  await server.close();
});

test("lists only published posts and returns safe rendered HTML", async () => {
  const response = await request((await fixture()).listener, "/api/v1/blogs");
  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body.total).toBe(1);
  expect(body.posts[0].slug).toBe("safe-post");
  expect(body.posts[0].html).toContain('<h1 id="hello">Hello</h1>');
  expect(body.posts[0].html).not.toContain("<script>");
  expect(body.posts[0].html).not.toContain("javascript:");
});

test("serves RSS and server-rendered article metadata", async () => {
  const listener = (await fixture()).listener;
  const feed = await request(listener, "/feed.xml");
  expect(feed.statusCode).toBe(200);
  expect(feed.headers["Content-Type"]).toContain("application/rss+xml");
  expect(feed.body.toString()).toContain("safe-post");
  expect(feed.body.toString()).not.toContain("draft-post");

  const article = await request(listener, "/blog/safe-post");
  expect(article.statusCode).toBe(200);
  expect(article.body.toString()).toContain("https://nodejs.eliware.org/blog/safe-post");
  expect(article.body.toString()).toContain('"@type":"TechArticle"');
  expect(article.body.toString()).toContain("<h1>Safe &lt;title&gt;</h1>");
  expect(article.body.toString()).toContain('data-server-rendered="true"');
  expect(article.body.toString().match(/<h1>/g)).toHaveLength(1);
});

test("serves the standard site footer on blog pages", async () => {
  const response = await request((await fixture()).listener, "/blog");
  const body = response.body.toString();
  expect(body).toContain('class="site-footer"');
  expect(body).toContain("Eliware · Node.js packaging");
  expect(body).toContain('href="/metadata/catalog.json"');
  expect(body).toMatch(/Host <code>[^<]+<\/code>/);
});

test("serves a published category page and preserves encoded route names", async () => {
  const listener = (await fixture()).listener;
  const category = await request(listener, "/blog/category/releases");
  expect(category.statusCode).toBe(200);
  expect(category.body.toString()).toContain("releases · Eliware");

  const encoded = await request(listener, "/blog/category/%252F");
  expect(encoded.statusCode).toBe(200);
  expect(encoded.body.toString()).toContain("https://nodejs.eliware.org/blog/category/%252F");
});

test("returns 404 for an unknown blog article", async () => {
  const response = await request((await fixture()).listener, "/blog/missing");
  expect(response.statusCode).toBe(404);
  expect(response.body.toString()).toContain("Blog post not found");
});

test("supports HEAD requests for blog pages", async () => {
  const listener = (await fixture()).listener;
  const response = new MockResponse();
  const finished = once(response, "finish");
  listener({ method: "HEAD", url: "/blog", headers: {} }, response);
  await finished;
  expect(response.statusCode).toBe(200);
  expect(response.headers["Content-Length"]).toBeGreaterThan(0);
  expect(response.body.length).toBe(0);
});
