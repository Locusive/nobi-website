// Tests for the Shop Nobi build step when there is nothing to render: an empty page list and failed fetches.
// They never start the page renderer, so they can run alongside prerender-shop.test.js.

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { prerenderShopNobiSearchPages } from "../scripts/prerender-shop.js";
import { startPageDataServer } from "./shop-nobi-pages-server.js";
import { ListingFiles, makeDistCopy, prerenderWith, readOriginal } from "./shop-nobi-test-build.js";

const PrerenderShopScript = fileURLToPath(new URL("../scripts/prerender-shop.js", import.meta.url));
const HttpNotFound = 404;
const HttpServerError = 500;
const runNode = promisify(execFile);

test("an empty page list builds, with an empty Shop Nobi sitemap and pin feed, and the other files unchanged", async () => {
  const folder = makeDistCopy();
  try {
    const count = await prerenderWith({ body: { generatedAt: "2026-10-11T08:10:00Z", pages: [], retired: [] } }, folder);
    assert.equal(count, 0);
    assert.ok(!existsSync(join(folder, "shop/s")) && !existsSync(join(folder, "shop.html")));
    assert.ok(!readFileSync(join(folder, "sitemap-shop.xml"), "utf8").includes("<url>"));
    assert.ok(!readFileSync(join(folder, "shop/pins.xml"), "utf8").includes("<item>"));
    for (const file of ListingFiles) {
      assert.equal(readFileSync(join(folder, file), "utf8"), readOriginal(file));
    }
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("a failed fetch of the search or sale pages fails without writing anything, whether the server errors or cannot be reached", async () => {
  const folder = makeDistCopy();
  try {
    await assert.rejects(prerenderWith({ status: HttpServerError }, folder), /status 500/);
    await assert.rejects(prerenderWith({ body: { pages: [] } }, folder), /"retired"/);
    await assert.rejects(prerenderWith({ saleStatus: HttpServerError }, folder), /sale-pages returned status 500/);
    await assert.rejects(prerenderWith({ saleBody: {} }, folder), /sale-pages has no "pages" list/);

    const closedServer = await startPageDataServer();
    await closedServer.close();
    await assert.rejects(prerenderShopNobiSearchPages({ apiBaseUrl: closedServer.url, distDir: folder }));

    assert.ok(!existsSync(join(folder, "sitemap-shop.xml")));
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("the build step exits with an error when the API route is missing, so the build fails", async () => {
  const server = await startPageDataServer({ status: HttpNotFound });
  try {
    const run = runNode(process.execPath, [PrerenderShopScript], { env: { ...process.env, SHOP_PAGES_API_URL: server.url } });
    await assert.rejects(run, (error) => error.code === 1 && error.stderr.includes("status 404"));
  } finally {
    await server.close();
  }
});
