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
const UtilityPaths = ["cove-vs-cubby", "marley-spoon-cost", "baseus-two-screens"];
const AuthoredPages = [
  ["https://nobi.ai/", "2026-10-17"],
  ...UtilityPaths.map((slug) => [`https://nobi.ai/tools/${slug}`, "2026-10-17"]),
];
const UtilityRevisions = Object.fromEntries(UtilityPaths.map((slug) => [`https://nobi.ai/tools/${slug}`, "a".repeat(64)]));

/** Builds a sitemap with one entry per slug and its lastmod. */
function makeSitemap(lastModifiedBySlug) {
  return makeUrlSitemap(Object.entries(lastModifiedBySlug).map(([slug, time]) => [`https://nobi.ai/shop/s/${slug}`, time]));
}

/** Builds the actual URL/lastmod form shared by both sitemap inputs. */
function makeUrlSitemap(pages) {
  const entries = pages.map(([url, time]) => `  <url>\n    <loc>${url.replaceAll("&", "&amp;")}</loc>\n    <lastmod>${time}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset>\n${entries.join("\n")}\n</urlset>\n`;
}

/** Starts a server that serves the live sitemap and records each IndexNow request. */
async function startSearchEngineServer({ sitemapStatus = 200, pageSitemapStatus = 200, revisionStatus = 200, indexNowStatus = 200, liveAuthoredPages = AuthoredPages, liveUtilityRevisions = UtilityRevisions } = {}) {
  const received = { paths: [], bodies: [] };
  const server = createServer((request, response) => {
    let text = "";
    request.on("data", (chunk) => (text += chunk));
    request.on("end", () => {
      received.paths.push(request.url);
      if (request.method === "POST") {
        received.bodies.push(JSON.parse(text));
      }
      const isAuthoredSitemap = request.url === "/sitemap-pages.xml";
      if (request.url === "/utility-revisions.json") {
        response.statusCode = revisionStatus;
        response.end(JSON.stringify({ version: 1, revisions: liveUtilityRevisions }));
        return;
      }
      response.statusCode = request.method === "POST" ? indexNowStatus : isAuthoredSitemap ? pageSitemapStatus : sitemapStatus;
      response.end(request.method === "POST" ? "" : isAuthoredSitemap ? makeUrlSitemap(liveAuthoredPages) : makeSitemap(LivePages));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  return { url, received, close: () => new Promise((resolve) => server.close(resolve)) };
}

/** Runs the submit step against a test server, from a build folder that holds the built sitemap. */
async function submitWith(env, serverOptions, endpointUrl = null, { builtAuthoredPages = AuthoredPages, builtShopXml = makeSitemap(BuiltPages), omitAuthoredFile = false, builtUtilityRevisions = UtilityRevisions, omitRevisionFile = false } = {}) {
  const distDir = mkdtempSync(join(tmpdir(), "indexnow-dist-"));
  writeFileSync(join(distDir, "sitemap-shop.xml"), builtShopXml);
  if (!omitAuthoredFile) writeFileSync(join(distDir, "sitemap-pages.xml"), makeUrlSitemap(builtAuthoredPages));
  if (!omitRevisionFile) writeFileSync(join(distDir, "utility-revisions.json"), JSON.stringify({ version: 1, revisions: builtUtilityRevisions }));
  const server = await startSearchEngineServer(serverOptions);
  try {
    const options = { env, distDir, liveSitemapUrl: `${server.url}/sitemap-shop.xml`, livePageSitemapUrl: `${server.url}/sitemap-pages.xml`, liveUtilityRevisionUrl: `${server.url}/utility-revisions.json`, endpointUrl: endpointUrl ?? `${server.url}/indexnow`, batchSize: 1 };
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

test("new and changed authored utilities join Shop Nobi pages, while unchanged utilities and marketing stay out", async () => {
  const { result, received } = await submitWith(ProductionEnv, {
    liveAuthoredPages: [["https://nobi.ai/", "2026-10-16"], AuthoredPages[1], ["https://nobi.ai/tools/marley-spoon-cost", "2026-10-16"]],
    liveUtilityRevisions: { [AuthoredPages[1][0]]: "a".repeat(64), [AuthoredPages[2][0]]: "b".repeat(64) },
  });
  assert.deepEqual(received.bodies.flatMap((body) => body.urlList), [
    "https://nobi.ai/shop/s/hats", "https://nobi.ai/shop/s/socks&ties",
    "https://nobi.ai/tools/marley-spoon-cost", "https://nobi.ai/tools/baseus-two-screens",
  ]);
  assert.deepEqual(result, { skipReason: null, changedCount: 4, batchCount: 4, failedBatchCount: 0 });
});

test("same-day utility content changes notify even when sitemap dates are identical", async () => {
  const { received } = await submitWith(ProductionEnv, {}, null, {
    builtUtilityRevisions: { ...UtilityRevisions, [AuthoredPages[2][0]]: "b".repeat(64) },
  });
  assert.deepEqual(received.bodies.flatMap((body) => body.urlList), [
    "https://nobi.ai/shop/s/hats", "https://nobi.ai/shop/s/socks&ties", AuthoredPages[2][0],
  ]);
});

test("unchanged utility revisions do not notify when build-day sitemap dates advance", async () => {
  const { received } = await submitWith(ProductionEnv, { liveAuthoredPages: AuthoredPages.map(([url]) => [url, "2026-10-16"]) });
  assert.deepEqual(received.bodies.flatMap((body) => body.urlList), ["https://nobi.ai/shop/s/hats", "https://nobi.ai/shop/s/socks&ties"]);
});

test("an authored sitemap without tools leaves normal Shop Nobi notifications intact", async () => {
  const { result, received } = await submitWith(ProductionEnv, {}, null, {
    builtAuthoredPages: [["https://nobi.ai/pricing", "2026-10-17"]],
  });
  assert.equal(result.changedCount, 2);
  assert.deepEqual(received.bodies.flatMap((body) => body.urlList), ["https://nobi.ai/shop/s/hats", "https://nobi.ai/shop/s/socks&ties"]);
});

test("only canonical own-site tools are selected from authored pages and foreign Shop addresses are rejected", async () => {
  const invalid = [
    "https://elsewhere.example/tools/foreign", "http://nobi.ai/tools/insecure",
    "https://nobi.ai/tools/query?campaign=1", "https://nobi.ai/tools/fragment#part",
    "https://nobi.ai/tools/query?", "https://nobi.ai/tools/fragment#",
    "https://person@nobi.ai/tools/credentials", "https://nobi.ai:8443/tools/port",
    "https://nobi.ai/product", "https://nobi.ai/tools/", "not-a-url",
  ].map((url) => [url, "2026-10-17"]);
  const { received } = await submitWith(ProductionEnv, {}, null, {
    builtAuthoredPages: [...AuthoredPages, ...invalid],
    builtShopXml: makeUrlSitemap([["https://elsewhere.example/shop/s/foreign", "2026-10-17"]]),
  });
  assert.deepEqual(received.bodies, []);
});

test("a utility found in both sitemaps is submitted once with the same-origin batch", async () => {
  const duplicate = ["https://nobi.ai/tools/baseus-two-screens", "2026-10-17"];
  const { result, received } = await submitWith(ProductionEnv, { liveAuthoredPages: [["https://nobi.ai/", "2026-10-17"]], liveUtilityRevisions: {} }, null, {
    builtAuthoredPages: [AuthoredPages[0], duplicate, duplicate], builtShopXml: makeUrlSitemap([duplicate]),
  });
  assert.deepEqual(result, { skipReason: null, changedCount: 1, batchCount: 1, failedBatchCount: 0 });
  assert.deepEqual(received.bodies[0].urlList, [duplicate[0]]);
});

test("an unreadable live authored sitemap skips submission instead of replaying all utilities", async () => {
  const { result, received } = await submitWith(ProductionEnv, { pageSitemapStatus: 404 });
  assert.equal(result.utilitySkipReason, "the live authored-page sitemap could not be read");
  assert.deepEqual(received.bodies.flatMap((body) => body.urlList), ["https://nobi.ai/shop/s/hats", "https://nobi.ai/shop/s/socks&ties"]);
});

for (const serverOptions of [{ revisionStatus: 404 }, { liveUtilityRevisions: { [AuthoredPages[1][0]]: "invalid" } }, { liveUtilityRevisions: {} }]) {
  test(`unknown live utility revisions stay visible without interrupting Shop notifications: ${JSON.stringify(serverOptions)}`, async () => {
    const { result, received } = await submitWith(ProductionEnv, serverOptions);
    assert.equal(result.utilitySkipReason, "the live utility revision metadata could not be read or validated");
    assert.deepEqual(received.bodies.flatMap((body) => body.urlList), ["https://nobi.ai/shop/s/hats", "https://nobi.ai/shop/s/socks&ties"]);
  });
}

test("a missing built authored sitemap remains an explicit file error", async () => {
  await assert.rejects(submitWith(ProductionEnv, {}, null, { omitAuthoredFile: true }), { code: "ENOENT" });
});

test("a missing built revision artifact remains an explicit file error", async () => {
  await assert.rejects(submitWith(ProductionEnv, {}, null, { omitRevisionFile: true }), { code: "ENOENT" });
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
