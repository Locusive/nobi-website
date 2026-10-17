import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildIndexNowBodies, IndexNowKey, readSitemapEntries, readSkipReason, selectChangedUrls } from "../scripts/shop-nobi-indexnow.js";
import { submitChangedShopNobiPages } from "../scripts/submit-indexnow.js";

const ProductionEnv = { CF_PAGES: "1", CF_PAGES_BRANCH: "main" };
const LivePages = { boots: "2026-10-10T08:00:00Z", hats: "2026-10-10T08:00:00Z", gone: "2026-10-10T08:00:00Z" };
const BuiltPages = { boots: "2026-10-10T08:00:00Z", hats: "2026-10-11T08:00:00Z", "socks&ties": "2026-10-11T08:00:00Z" };

/** Builds a sitemap with one entry per slug and its lastmod. */
function makeSitemap(lastModifiedBySlug) {
  const entries = Object.entries(lastModifiedBySlug).map(
    ([slug, time]) => `  <url>\n    <loc>https://nobi.ai/shop/s/${slug.replace("&", "&amp;")}</loc>\n    <lastmod>${time}</lastmod>\n  </url>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset>\n${entries.join("\n")}\n</urlset>\n`;
}

/** Starts a server that serves the live sitemap and records each IndexNow request. */
async function startSearchEngineServer({ sitemapStatus = 200, indexNowStatus = 200 } = {}) {
  const received = { paths: [], bodies: [] };
  const server = createServer((request, response) => {
    let text = "";
    request.on("data", (chunk) => (text += chunk));
    request.on("end", () => {
      received.paths.push(request.url);
      if (request.method === "POST") {
        received.bodies.push(JSON.parse(text));
      }
      response.statusCode = request.method === "POST" ? indexNowStatus : sitemapStatus;
      response.end(request.method === "POST" ? "" : makeSitemap(LivePages));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  return { url, received, close: () => new Promise((resolve) => server.close(resolve)) };
}

/** Runs the submit step against a test server, from a build folder that holds the built sitemap. */
async function submitWith(env, serverOptions, endpointUrl = null) {
  const distDir = mkdtempSync(join(tmpdir(), "indexnow-dist-"));
  writeFileSync(join(distDir, "sitemap-shop.xml"), makeSitemap(BuiltPages));
  const server = await startSearchEngineServer(serverOptions);
  try {
    const options = { env, distDir, liveSitemapUrl: `${server.url}/sitemap-shop.xml`, endpointUrl: endpointUrl ?? `${server.url}/indexnow`, batchSize: 1 };
    const result = await submitChangedShopNobiPages(options);
    return { result, received: server.received };
  } finally {
    await server.close();
    rmSync(distDir, { recursive: true, force: true });
  }
}

test("only addresses that are new or have a new lastmod are picked, in sitemap order, with escapes undone", () => {
  const changed = selectChangedUrls(readSitemapEntries(makeSitemap(LivePages)), readSitemapEntries(makeSitemap(BuiltPages)));
  assert.deepEqual(changed, ["https://nobi.ai/shop/s/hats", "https://nobi.ai/shop/s/socks&ties"]);
});

test("an entry that gains or loses its lastmod counts as changed", () => {
  const withTime = readSitemapEntries("<url><loc>https://nobi.ai/shop/s/a</loc><lastmod>2026-10-11</lastmod></url>");
  const withoutTime = readSitemapEntries("<url><loc>https://nobi.ai/shop/s/a</loc></url>");
  assert.deepEqual(selectChangedUrls(withoutTime, withTime), ["https://nobi.ai/shop/s/a"]);
  assert.deepEqual(selectChangedUrls(withTime, withoutTime), ["https://nobi.ai/shop/s/a"]);
});

for (const [env, reason] of [
  [{}, "not a Cloudflare Pages build"],
  [{ CF_PAGES: "1", CF_PAGES_BRANCH: "shop-nobi-25-indexnow" }, "a preview build"],
  [{ CF_PAGES: "1" }, "a preview build"],
  [{ ...ProductionEnv, SHOP_PAGES_API_URL: "http://127.0.0.1:4789" }, "built from other page data"],
  [ProductionEnv, null],
]) {
  test(`the skip reason for ${JSON.stringify(env)} is ${reason}`, () => {
    assert.equal(readSkipReason(env), reason);
  });
}

test("addresses go out in batches of at most 10,000, each with the key and its file", () => {
  const urls = Array.from({ length: 20001 }, (_, index) => `https://nobi.ai/shop/s/page-${index}`);
  const bodies = buildIndexNowBodies(urls);
  assert.deepEqual(bodies.map((body) => body.urlList.length), [10000, 10000, 1]);
  assert.deepEqual(bodies.flatMap((body) => body.urlList), urls);
  const { urlList, ...rest } = bodies[0];
  assert.deepEqual(rest, { host: "nobi.ai", key: IndexNowKey, keyLocation: `https://nobi.ai/${IndexNowKey}.txt` });
});

test("the key file at the site root holds the key, in the form IndexNow accepts", () => {
  assert.match(IndexNowKey, /^[A-Za-z0-9-]{8,128}$/);
  assert.equal(readFileSync(new URL(`../public/${IndexNowKey}.txt`, import.meta.url), "utf8").trim(), IndexNowKey);
});

test("a production build submits the new and changed addresses, one batch each here", async () => {
  const { result, received } = await submitWith(ProductionEnv);
  assert.deepEqual(result, { skipReason: null, changedCount: 2, batchCount: 2, failedBatchCount: 0 });
  assert.deepEqual(received.bodies.map((body) => body.urlList), [["https://nobi.ai/shop/s/hats"], ["https://nobi.ai/shop/s/socks&ties"]]);
});

test("a skipped build asks nothing of the live site or IndexNow", async () => {
  const { result, received } = await submitWith({ CF_PAGES: "1", CF_PAGES_BRANCH: "preview" });
  assert.equal(result.skipReason, "a preview build");
  assert.deepEqual(received.paths, []);
});

test("an unreadable live sitemap submits nothing, so a missing sitemap never sends every page", async () => {
  const { result, received } = await submitWith(ProductionEnv, { sitemapStatus: 404 });
  assert.equal(result.skipReason, "the live sitemap could not be read");
  assert.deepEqual(received.bodies, []);
});

// Port 9 is a reserved port nothing listens on, so a request to it is refused.
for (const [name, serverOptions, endpointUrl] of [
  ["refuses every batch", { indexNowStatus: 429 }, null],
  ["cannot be reached", {}, "http://127.0.0.1:9/indexnow"],
]) {
  test(`when IndexNow ${name}, the step still finishes and counts the failed batches`, async () => {
    const { result } = await submitWith(ProductionEnv, serverOptions, endpointUrl);
    assert.deepEqual(result, { skipReason: null, changedCount: 2, batchCount: 2, failedBatchCount: 2 });
  });
}
