import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { prerenderShopNobiSearchPages } from "../scripts/prerender-shop.js";
import { countRedirectRules } from "../scripts/shop-nobi-search-page-listings.js";
import { startPageDataServer } from "./shop-nobi-pages-server.js";

const BuiltDist = fileURLToPath(new URL("../dist/", import.meta.url));
// The build's own run adds to _redirects and llms.txt, so the copies start from the originals in public/.
const OriginalPublic = fileURLToPath(new URL("../public/", import.meta.url));
const PrerenderShopScript = fileURLToPath(new URL("../scripts/prerender-shop.js", import.meta.url));
const ListingFiles = ["_redirects", "llms.txt"];
const HttpNotFound = 404;
const HttpServerError = 500;
const runNode = promisify(execFile);

let distDir;

/** Copies the built shell and the original listing files into a new folder, so each run starts clean. */
function makeDistCopy() {
  const folder = mkdtempSync(join(tmpdir(), "shop-nobi-dist-"));
  copyFileSync(join(BuiltDist, "index.html"), join(folder, "index.html"));
  ListingFiles.forEach((file) => copyFileSync(join(OriginalPublic, file), join(folder, file)));
  return folder;
}

function readOriginal(file) {
  return readFileSync(join(OriginalPublic, file), "utf8");
}

/** Runs the build step against a local server that sends the given response. */
async function prerenderWith(response, folder, limits = {}) {
  const server = await startPageDataServer(response);
  try {
    return await prerenderShopNobiSearchPages({ dataUrl: server.url, distDir: folder, ...limits });
  } finally {
    await server.close();
  }
}

function readOutput(path) {
  return readFileSync(join(distDir, path), "utf8");
}

/** Reads the JSON in the script element with the given id. */
function readScriptJson(html, id) {
  const match = html.match(new RegExp(`<script type="application/(?:ld\\+)?json" id="${id}">([^<]*)</script>`));
  assert.ok(match, `Missing script element ${id}`);
  return JSON.parse(match[1]);
}

/** Reads the HTML inside #root, which is what a crawler sees as the page. */
function readBody(html) {
  return html.slice(html.indexOf('<div id="root">'));
}

before(async () => {
  distDir = makeDistCopy();
  const count = await prerenderWith({}, distDir);
  assert.equal(count, 3);
});

after(() => rmSync(distDir, { recursive: true, force: true }));

test("each page is written once, as <slug>.html, and a page with an unsafe slug is skipped", () => {
  for (const slug of ["black-leather-boots", "chelsea-boots", "boots"]) {
    assert.ok(readOutput(`shop/s/${slug}.html`).includes("<!doctype html>"), slug);
    assert.ok(!existsSync(join(distDir, `shop/s/${slug}`)), `No second copy for ${slug}`);
  }
  assert.ok(!existsSync(join(distDir, "shop/escape.html")));
  assert.ok(!existsSync(join(distDir, "shop/s/escape.html")));
});

test("the head carries the page's own title, description, canonical, robots and link previews", () => {
  const html = readOutput("shop/s/black-leather-boots.html");
  const description = "Black Leather Boots from the best stores online, in one search. Shop Nobi is a search engine: you buy directly from the store.";
  for (const tag of [
    "<title>Black Leather Boots | Shop Nobi</title>",
    `<meta name="description" content="${description}">`,
    '<link rel="canonical" href="https://nobi.ai/shop/s/black-leather-boots">',
    '<meta name="robots" content="index, follow">',
    '<meta property="og:url" content="https://nobi.ai/shop/s/black-leather-boots">',
    '<meta name="twitter:title" content="Black Leather Boots | Shop Nobi">',
  ]) {
    assert.ok(html.includes(tag), `Missing tag: ${tag}`);
  }
  for (const repeatable of ['rel="canonical"', 'name="robots"', 'id="page-schema"', "<title>", 'name="description"']) {
    assert.equal(html.split(repeatable).length - 1, 1, `Expected one ${repeatable}`);
  }
});

test("the structured data lists each product with its offer, and the breadcrumbs link only live pages", () => {
  const [productList, breadcrumbs] = readScriptJson(readOutput("shop/s/black-leather-boots.html"), "page-schema");

  assert.equal(productList["@type"], "ItemList");
  const products = productList.itemListElement.map((entry) => entry.item);
  assert.deepEqual(products.map((product) => product.name), ["Roper Boot", '<script>alert("boot")</script> & "Cowboy" $& Boot']);
  assert.deepEqual(products[0].brand, { "@type": "Brand", name: "Lucchese" });
  assert.deepEqual(products[0].offers, {
    "@type": "Offer",
    price: 495,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://lucchese.com/products/roper?variant=123",
  });
  assert.equal(products[1].offers.availability, "https://schema.org/OutOfStock");
  assert.equal(products[1].image, undefined, "A javascript: picture address is dropped");

  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
  assert.deepEqual(
    breadcrumbs.itemListElement.map((crumb) => [crumb.position, crumb.name, crumb.item]),
    [
      [1, "Shop Nobi", "https://nobi.ai/shop"],
      [2, "Boots", "https://nobi.ai/shop/s/boots"],
      [3, "Black Leather Boots", "https://nobi.ai/shop/s/black-leather-boots"],
    ]
  );
});

test("the visible page shows the products with links crawlers do not follow and no tracking tags", () => {
  const body = readBody(readOutput("shop/s/black-leather-boots.html"));

  assert.ok(body.includes('<h1 class="mt-4 text-3xl font-semibold">Black Leather Boots</h1>'));
  assert.ok(body.includes('<img src="https://cdn.example.com/roper.jpg" alt="Roper Boot"'));
  assert.ok(body.includes("$495.00") && body.includes("€120.00"));
  const productLinks = [...body.matchAll(/<a href="(https?:[^"]+)"([^>]*)>/g)].filter(([, href]) => !href.includes("nobi.ai"));
  assert.equal(productLinks.length, 2, "The product with a javascript: link is dropped");
  for (const [, href, attributes] of productLinks) {
    assert.ok(attributes.includes('rel="nofollow noopener"') && attributes.includes('target="_blank"'), href);
    assert.ok(!href.includes("utm_"), href);
  }
  assert.ok(!body.includes("javascript:"));
  assert.ok(!body.includes("Loading Shop Nobi"));
});

test("breadcrumb and related links point only to live pages", () => {
  const body = readBody(readOutput("shop/s/black-leather-boots.html"));
  const pageLinks = [...body.matchAll(/href="(\/shop[^"]*)"/g)].map(([, href]) => href);
  assert.deepEqual(pageLinks, ["/shop", "/shop", "/shop/s/boots", "/shop/s/chelsea-boots"]);
  assert.ok(body.includes("Shoes"), "A category without a live page still shows as text");
});

test("a hostile product name is escaped everywhere and its embedded data reads back unchanged", () => {
  const html = readOutput("shop/s/black-leather-boots.html");
  const hostileName = '<script>alert("boot")</script> & "Cowboy" $& Boot';

  assert.ok(!html.includes('<script>alert("boot")'));
  assert.ok(!html.includes("<b>"));
  assert.ok(readBody(html).includes("&lt;script&gt;alert(&quot;boot&quot;)&lt;/script&gt; &amp; &quot;Cowboy&quot; $&amp; Boot"));

  const page = readScriptJson(html, "shop-nobi-search-page");
  assert.equal(page.products[1].name, hostileName);
  assert.equal(page.query, "black leather boots");
  assert.ok(html.indexOf('id="shop-nobi-search-page"') < html.indexOf("readNobiAssistantOptions"), "The data comes before the bundle starts");
});

test("retired pages redirect permanently, except ones that are live again or have unsafe targets", () => {
  const redirects = readOutput("_redirects");
  assert.ok(redirects.startsWith(readOriginal("_redirects").trimEnd()));
  assert.match(redirects, /^\/shop\/s\/neon-boots \/shop\/s\/black-leather-boots 301$/m);
  assert.match(redirects, /^\/shop\/s\/old-boots \/shop 301$/m);
  assert.ok(!redirects.includes("/shop/s/chelsea-boots /shop"));
  assert.ok(!redirects.includes("bad-target") && !redirects.includes("evil"));
});

test("the sitemap index points to the site's pages and to the Shop Nobi sitemap, which lists each live page", () => {
  const sitemapIndex = readFileSync(join(BuiltDist, "sitemap.xml"), "utf8");
  assert.ok(sitemapIndex.includes("<sitemapindex"));
  assert.ok(sitemapIndex.includes("<loc>https://nobi.ai/sitemap-pages.xml</loc>"));
  assert.ok(sitemapIndex.includes("<loc>https://nobi.ai/sitemap-shop.xml</loc>"));
  assert.ok(readFileSync(join(BuiltDist, "sitemap-pages.xml"), "utf8").includes("<loc>https://nobi.ai/pricing</loc>"));

  const shopSitemap = readOutput("sitemap-shop.xml");
  assert.ok(shopSitemap.includes(
    "<loc>https://nobi.ai/shop/s/black-leather-boots</loc>\n    <lastmod>2026-10-11T08:02:11Z</lastmod>"
  ));
  assert.equal(shopSitemap.split("<url>").length - 1, 3);
  assert.ok(!shopSitemap.includes("neon-boots"));
});

test("llms.txt keeps its own text and gains a Shop Nobi section with links to the pages", () => {
  const llmsText = readOutput("llms.txt");
  assert.ok(llmsText.startsWith(readOriginal("llms.txt").trimEnd()));
  assert.ok(llmsText.includes("## Shop Nobi"));
  assert.ok(llmsText.includes("- [Black Leather Boots](https://nobi.ai/shop/s/black-leather-boots)"));
});

test("when the file limit is reached, only the first pages are built, and the rest stay out of every listing", async () => {
  const folder = makeDistCopy();
  const sitemapAndOnePage = 2;
  try {
    const copiedFileCount = 1 + ListingFiles.length;
    const count = await prerenderWith({}, folder, { fileLimit: copiedFileCount + sitemapAndOnePage });
    assert.equal(count, 1);
    assert.ok(existsSync(join(folder, "shop/s/black-leather-boots.html")));
    assert.ok(!existsSync(join(folder, "shop/s/chelsea-boots.html")) && !existsSync(join(folder, "shop/s/boots.html")));

    const sitemap = readFileSync(join(folder, "sitemap-shop.xml"), "utf8");
    const llmsText = readFileSync(join(folder, "llms.txt"), "utf8");
    assert.equal(sitemap.split("<url>").length - 1, 1);
    assert.ok(!llmsText.includes("chelsea-boots") && !llmsText.includes("/shop/s/boots)"));

    const body = readBody(readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8"));
    assert.ok(!body.includes('href="/shop/s/'), "No links to pages that were left out");
    assert.ok(body.includes(">Boots</li>") && body.includes("Chelsea Boots</li>"), "They show as plain text");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("redirects for retired pages stop at the rule limit, keeping the first ones in the file", async () => {
  const folder = makeDistCopy();
  const existingRules = countRedirectRules(readOriginal("_redirects"));
  try {
    await prerenderWith({}, folder, { redirectRuleLimit: existingRules + 1 });
    const redirects = readFileSync(join(folder, "_redirects"), "utf8");
    assert.equal(countRedirectRules(redirects), existingRules + 1);
    assert.ok(redirects.includes("/shop/s/neon-boots ") && !redirects.includes("old-boots"));
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("an empty page list builds, with an empty Shop Nobi sitemap and the other files unchanged", async () => {
  const folder = makeDistCopy();
  try {
    const count = await prerenderWith({ body: { generatedAt: "2026-10-11T08:10:00Z", pages: [], retired: [] } }, folder);
    assert.equal(count, 0);
    assert.ok(!existsSync(join(folder, "shop")));
    assert.ok(!readFileSync(join(folder, "sitemap-shop.xml"), "utf8").includes("<url>"));
    for (const file of ListingFiles) {
      assert.equal(readFileSync(join(folder, file), "utf8"), readOriginal(file));
    }
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("a failed download fails without writing anything, whether the server errors or cannot be reached", async () => {
  const folder = makeDistCopy();
  try {
    await assert.rejects(prerenderWith({ status: HttpServerError }, folder), /status 500/);
    await assert.rejects(prerenderWith({ body: { pages: [] } }, folder), /"retired"/);

    const closedServer = await startPageDataServer();
    await closedServer.close();
    await assert.rejects(prerenderShopNobiSearchPages({ dataUrl: closedServer.url, distDir: folder }));

    assert.ok(!existsSync(join(folder, "sitemap-shop.xml")));
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("the build step exits with an error when the data file is missing, so the build fails", async () => {
  const server = await startPageDataServer({ status: HttpNotFound });
  try {
    const run = runNode(process.execPath, [PrerenderShopScript], { env: { ...process.env, SHOP_PAGES_DATA_URL: server.url } });
    await assert.rejects(run, (error) => error.code === 1 && error.stderr.includes("status 404"));
  } finally {
    await server.close();
  }
});
