import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fetchSearchPagesData } from "../scripts/shop-nobi-search-pages-api.js";
import { prerenderShopNobiSearchPages } from "../scripts/prerender-shop.js";
import { ListingFiles, makeDistCopy, readOriginal } from "./shop-nobi-test-build.js";

const ApprovedTitle = "Audio Components: Speakers, Headphones & System Add-ons";
const PreviousTitle = "Best Audio Components from Top Stores";

/** Builds a small public page export without changing the product's identity or value. */
function pageExport(ageMinutes, title = ApprovedTitle) {
  return {
    generatedAt: new Date(Date.now() - ageMinutes * 60_000).toISOString(),
    pages: [{ slug: "audio-components", title, products: [{ name: "Speaker", price: 330, url: "https://store.example/speaker" }] }],
    retired: [],
  };
}

/** Serves successive real HTTP responses, retaining the final response for later requests. */
async function startExportServer(exportSequence) {
  const requestPaths = [];
  const server = createServer((request, response) => {
    const responseIndex = Math.min(requestPaths.length, exportSequence.length - 1);
    requestPaths.push(request.url);
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(exportSequence[responseIndex]));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    requestPaths,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

test("wait for a fresh listing after the API first serves its previous cached answer", async () => {
  const currentExport = pageExport(0);
  const server = await startExportServer([pageExport(60, PreviousTitle), currentExport]);
  try {
    const result = await fetchSearchPagesData(server.url);
    assert.deepEqual(result, currentExport, "Use the current copy and unchanged product objects, never the stale title.");
    assert.deepEqual(server.requestPaths, ["/v1/shop/pages", "/v1/shop/pages"], "Read the same route without a cache-bypass query.");
  } finally {
    await server.close();
  }
});

test("stop a persistently stale build before writing pages, feeds or redirects", async () => {
  const server = await startExportServer([pageExport(60, PreviousTitle)]);
  const folder = makeDistCopy();
  try {
    await assert.rejects(
      prerenderShopNobiSearchPages({ apiBaseUrl: server.url, distDir: folder }),
      /older than 15 minutes after 4 reads/,
    );
    assert.deepEqual(server.requestPaths, Array(4).fill("/v1/shop/pages"));
    for (const file of ["shop/s", "sitemap-shop.xml", "shop/pins.xml"]) assert.equal(existsSync(join(folder, file)), false, file);
    for (const file of ListingFiles) assert.equal(readFileSync(join(folder, file), "utf8"), readOriginal(file));
  } finally {
    await server.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

test("reject malformed or implausibly future generation times without retrying", async () => {
  for (const generatedAt of [null, "not-a-time", "October 19, 2026", "2026-02-30T08:00:00Z", new Date(Date.now() + 120_000).toISOString()]) {
    const server = await startExportServer([{ ...pageExport(0), generatedAt }]);
    try {
      await assert.rejects(fetchSearchPagesData(server.url), /invalid generatedAt/);
      assert.deepEqual(server.requestPaths, ["/v1/shop/pages"], String(generatedAt));
    } finally {
      await server.close();
    }
  }
});

test("accept a legitimate cached listing without forcing regeneration", async () => {
  const cachedExport = pageExport(13);
  const server = await startExportServer([cachedExport]);
  try {
    assert.deepEqual(await fetchSearchPagesData(server.url), cachedExport);
    assert.deepEqual(server.requestPaths, ["/v1/shop/pages"]);
  } finally {
    await server.close();
  }
});
