import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { buildShopNobiSitemap, countRedirectRules } from "../scripts/shop-nobi-search-page-listings.js";
import { FileCountBeforePages, makeDistCopy, prerenderWith, readBody, readOriginal, readScriptJson } from "./shop-nobi-test-build.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { decodePaidLink } from "../src/utils/shopNobiPaidLink.js";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";

let distDir;

test("built products retain only known placement decisions without inventing decisions for old page data", () => {
  const source = readFixturePageData().pages[0];
  const reasons = ["affiliate", "paid_merchant", "organic", undefined, "Boost"];
  const storyPaidLinks = [true, false, undefined, "true", null];
  const page = { ...source, products: reasons.map((placementReason, index) => ({ ...source.products[0], placementReason,
    storyPaidLink: storyPaidLinks[index] })) };
  const { pages } = buildSearchPages([page], 1);
  assert.deepEqual(pages[0].products.map(product => product.placementReason), reasons.slice(0, 3).concat([undefined, undefined]));
  assert.deepEqual(pages[0].products.map(product => product.storyPaidLink), [true, false, undefined, undefined, undefined]);
});

function readOutput(path) {
  return readFileSync(join(distDir, path), "utf8");
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
  assert.ok(!existsSync(join(distDir, "shop/escape.html")) && !existsSync(join(distDir, "shop/s/escape.html")));
});

test("the head carries the page's own title, description, canonical, robots and link previews, escaped", () => {
  const html = readOutput("shop/s/black-leather-boots.html");
  const description = "Black leather boots for work &amp; weekends, from &quot;classic&quot; ropers to &lt;lace-ups&gt;.";
  for (const tag of [
    "<title>Black Leather Boots | Shop Nobi</title>",
    `<meta name="description" content="${description}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta name="twitter:description" content="${description}">`,
    '<meta property="og:title" content="Black Leather Boots | Shop Nobi">',
    '<link rel="alternate" type="application/rss+xml" title="Shop Nobi searches" href="https://nobi.ai/shop/pins.xml">',
    '<link rel="canonical" href="https://nobi.ai/shop/s/black-leather-boots">',
    '<meta name="robots" content="index, follow, max-image-preview:large">',
    '<meta property="og:url" content="https://nobi.ai/shop/s/black-leather-boots">',
    '<meta name="twitter:title" content="Black Leather Boots | Shop Nobi">',
  ]) {
    assert.ok(html.includes(tag), `Missing tag: ${tag}`);
  }
  for (const repeatable of ['rel="canonical"', 'name="robots"', 'id="page-schema"', "<title>", 'name="description"']) {
    assert.equal(html.split(repeatable).length - 1, 1, `Expected one ${repeatable}`);
  }
});

test("under the heading come the updated date, the description and the guide, escaped, in that order", () => {
  const body = readBody(readOutput("shop/s/black-leather-boots.html"));
  const expectedTop = [
    '<h1 class="mt-4 text-3xl font-semibold">Black Leather Boots</h1>',
    '<p class="mt-1 text-sm text-black/50 dark:text-white/50">Updated October 11, 2026</p>',
    '<p class="mt-2 max-w-3xl text-black/70 dark:text-white/70">',
    "Black leather boots for work &amp; weekends, from &quot;classic&quot; ropers to &lt;lace-ups&gt;.</p>",
    '<p class="mt-3 max-w-3xl text-black/70 dark:text-white/70">Leather &lt;boots&gt; last for years with care.</p>',
    '<p class="mt-3 max-w-3xl text-black/70 dark:text-white/70">Pick a pair that fits your work &amp; weekends.</p>',
    '<ul class="mt-6 grid',
  ].join("");
  assert.ok(body.includes(expectedTop), "A blank guide paragraph is skipped");
});

test("a page with a blank or missing description, and no guide or questions, gets the standard description and no extras", () => {
  for (const [slug, title] of [["chelsea-boots", "Chelsea Boots"], ["boots", "Boots"]]) {
    const description = `${title} from the best stores online, in one search. Shop Nobi is a search engine: you buy directly from the store.`;
    assert.ok(readOutput(`shop/s/${slug}.html`).includes(`<meta name="description" content="${description}">`), slug);
  }

  const body = readBody(readOutput("shop/s/boots.html"));
  const expectedTop = [
    '<h1 class="mt-4 text-3xl font-semibold">Boots</h1>',
    '<p class="mt-1 text-sm text-black/50 dark:text-white/50">Updated October 9, 2026</p>',
    '<ul class="mt-6 grid',
  ].join("");
  assert.ok(body.includes(expectedTop));
  assert.ok(!body.includes(">Questions</h2>"));
  assert.equal(readScriptJson(readOutput("shop/s/boots.html"), "page-schema").length, 2, "No FAQPage without questions");
});

test("questions show after the products, and the structured data carries them as an FAQPage", () => {
  const html = readOutput("shop/s/black-leather-boots.html");
  const body = readBody(html);
  const questions = '<h2 class="text-lg font-semibold">Questions</h2><div class="mt-4"><h3 class="font-medium">'
    + "Are leather boots &lt;waterproof&gt;?</h3>"
    + '<p class="mt-1 text-black/70 dark:text-white/70">Most need a coat of wax &amp; care.</p></div></section>';
  assert.ok(body.includes(questions), "Only the question with an answer shows");
  assert.ok(body.indexOf(">Questions</h2>") > body.indexOf("$495.00"));

  const faqPage = readScriptJson(html, "page-schema")[2];
  assert.deepEqual(faqPage, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [{
      "@type": "Question",
      name: "Are leather boots <waterproof>?",
      acceptedAnswer: { "@type": "Answer", text: "Most need a coat of wax & care." },
    }],
  });
});

test("the structured data lists each product with its offer, and the breadcrumbs from Shop Nobi to the page", () => {
  const [productList, breadcrumbs] = readScriptJson(readOutput("shop/s/black-leather-boots.html"), "page-schema");

  assert.equal(productList["@type"], "ItemList");
  const products = productList.itemListElement.map((entry) => entry.item);
  const productNames = ["Roper Boot", '<script>alert("boot")</script> & "Cowboy" $& Boot', "Harness Boot"];
  assert.deepEqual(products.map((product) => product.name), productNames, "No unsafe link and no javascript: picture");
  assert.deepEqual(products[0].brand, { "@type": "Brand", name: "Lucchese" });
  const roperUrl = "https://lucchese.com/products/roper?variant=123";
  const roperOffer = { "@type": "Offer", price: 495, priceCurrency: "USD", availability: "https://schema.org/InStock", url: roperUrl };
  assert.deepEqual(products[0].offers, roperOffer);
  assert.equal(products[1].offers.availability, "https://schema.org/OutOfStock");

  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
  assert.deepEqual(
    breadcrumbs.itemListElement.map((crumb) => [crumb.position, crumb.name, crumb.item]),
    [
      [1, "Shop Nobi", "https://nobi.ai/shop"],
      [2, "Shoes", "https://nobi.ai/shop/c/shoes"],
      [3, "Boots", "https://nobi.ai/shop/s/boots"],
      [4, "Black Leather Boots", "https://nobi.ai/shop/s/black-leather-boots"],
    ]
  );
});

test("the visible page shows the products, opening store links in a new tab with no tracking tags", () => {
  const body = readBody(readOutput("shop/s/black-leather-boots.html"));

  assert.ok(body.includes('<img src="https://cdn.example.com/roper.jpg" alt="Roper Boot"'));
  assert.ok(body.includes("$495.00") && body.includes("€120.00"));
  const productLinks = [...body.matchAll(/<a href="(https?:[^"]+)"([^>]*)>/g)].filter(([, href]) => !href.includes("nobi.ai"));
  assert.equal(productLinks.length, 3, "The products with a javascript: link or picture are dropped");
  assert.ok(!body.includes("Pictureless Boot"), "A product without a safe picture gets no card");
  for (const [, href, attributes] of productLinks) {
    assert.ok(attributes.includes('target="_blank"'), href);
    assert.ok(!href.includes("utm_"), href);
  }
  assert.ok(!body.includes("javascript:"));
  assert.ok(!body.includes("Loading Shop Nobi"));
});

test("breadcrumbs and built related searches keep their existing page links", () => {
  const body = readBody(readOutput("shop/s/black-leather-boots.html"));
  const pageContent = body.split("<footer")[0];
  const pageLinks = [...pageContent.matchAll(/href="(\/shop[^"]*)"/g)].map(([, href]) => href);
  assert.deepEqual(pageLinks, ["/shop", "/shop/mcp", "/shop", "/shop/c/shoes", "/shop/s/boots", "/shop/stories/black-leather-boots", "/shop/s/chelsea-boots"]);

  const bootsBody = readBody(readOutput("shop/s/boots.html"));
  assert.ok(bootsBody.includes('<a href="/shop/c/shoes" class="hover:underline">Shoes</a>'), "Even when the crumb has no search page");
});

test("related searches outside the build limit launch the original query instead of a missing page", async () => {
  const data = readFixturePageData();
  const query = '  boots & bags / "weekend" + <travel>  ';
  data.pages[0].relatedSlugs = ["chelsea-boots", "boots", "chelsea-boots", "not-a-live-page"];
  data.pages[1].query = query;
  data.pages[2].query = "  ";
  const folder = makeDistCopy();
  try {
    const categoryAndOnePage = 2;
    const count = await prerenderWith({ body: data }, folder, { fileLimit: FileCountBeforePages + categoryAndOnePage });
    assert.equal(count, 1, "Only the source search page is built");
    const body = readBody(readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8"));
    const relatedStart = body.indexOf(">Related searches</h2>");
    const related = body.slice(relatedStart, body.indexOf("</section>", relatedStart));
    const links = [...related.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
    assert.deepEqual(links.map(([, , title]) => title), ["Chelsea Boots", "Boots"], "Unknown and duplicate suggestions are omitted");
    const addresses = links.map(([, href]) => new URL(href, "https://nobi.ai"));
    assert.deepEqual(addresses.map((url) => url.pathname), ["/shop", "/shop"]);
    assert.deepEqual(addresses.map((url) => [...url.searchParams.keys()]), [["q"], ["q"]]);
    assert.deepEqual(addresses.map((url) => url.searchParams.get("q")), [query.trim(), "Boots"], "Use the original query, falling back to the title for a blank query");
    assert.ok(!related.includes('href="/shop/s/chelsea-boots"'), "Do not link to an unbuilt page");
    assert.ok(!related.includes("<travel>"), "Query markup stays encoded in the address");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("every link to a store in the prebuilt pages carries rel=nofollow", () => {
  const pages = ["shop/s/black-leather-boots.html", "shop/s/chelsea-boots.html", "shop/s/boots.html", "shop/c/shoes.html", "shop.html"];
  for (const page of pages) {
    const links = [...readBody(readOutput(page)).matchAll(/<a\b([^>]*)>/g)].map(([, attributes]) => attributes);
    const storeLinks = links.filter((attributes) => /href="https?:/.test(attributes) && !/href="https:\/\/[a-z.]*nobi\.ai/.test(attributes));
    for (const attributes of storeLinks) {
      assert.match(attributes, /rel="[^"]*nofollow/, `${page}: ${attributes}`);
    }
  }
});

test("a paid product keeps its plain link for crawlers, with rel=sponsored and a commission notice at the end of its card", () => {
  const body = readBody(readOutput("shop/s/black-leather-boots.html"));
  const productLinks = [...body.matchAll(/<a href="(https?:[^"]+)" rel="([^"]+)"/g)].map(([, href, rel]) => [href, rel]);

  assert.deepEqual(productLinks, [
    ["https://lucchese.com/products/roper?variant=123", "sponsored nofollow noopener"],
    ["https://example.com/products/cowboy", "nofollow noopener"],
    ["https://frye.example/products/harness", "nofollow noopener"],
  ]);
  const notice = '<p class="mt-1 text-[10px] leading-tight text-black/40 dark:text-white/40">We may earn a commission</p>';
  assert.equal(body.split(notice).length - 1, 1, "Only the paid product has the notice");
  assert.ok(body.includes(`$495.00</p>${notice}</li>`), "The notice ends the paid product's card");
  assert.ok(!readBody(readOutput("shop/s/chelsea-boots.html")).includes("commission"), "An unpaid product gets no notice");
});

test("a page's HTML holds no finished store link as text, and only paid products carry one, in base64", () => {
  const fixtureProducts = readFixturePageData().pages.flatMap((page) => page.products);
  const finishedLinks = fixtureProducts.flatMap((product) => [product.storeLink, product.storyStoreLink]).filter(Boolean);
  for (const page of ["shop/s/black-leather-boots.html", "shop/s/chelsea-boots.html"]) {
    const html = readOutput(page);
    assert.ok(finishedLinks.every((link) => !html.includes(link) && !html.includes(link.replaceAll("&", "&amp;"))), page);
    assert.ok(!html.includes("sovrn.co"), page);
  }

  const products = readScriptJson(readOutput("shop/s/black-leather-boots.html"), "shop-nobi-prebuilt-content").data.products;
  assert.equal(decodePaidLink(products[0].encodedStoreLink), fixtureProducts[0].storeLink, "The click opens the paid link as sent");
  for (const product of products.slice(1)) {
    assert.deepEqual([product.paidLink, product.encodedStoreLink], [false, undefined]);
  }
});

test("a product keeps its variant and store ids when both are real ids, so the page can record what it showed", () => {
  const products = readScriptJson(readOutput("shop/s/black-leather-boots.html"), "shop-nobi-prebuilt-content").data.products;

  assert.deepEqual([products[0].productVariantId, products[0].owningMerchantId], [
    "8e4a3b21-1d55-4c2b-9b86-3a7f2a6e0003",
    "35019f05-f0cd-4ee3-ba16-c1fe938888d1",
  ]);
  for (const product of products.slice(1)) {
    assert.deepEqual([product.productVariantId, product.owningMerchantId], [undefined, undefined], product.name);
  }
});

test("a story's paid product goes through the link route like every product, sponsored and with the notice under it", () => {
  const story = readOutput("shop/stories/black-leather-boots.html");
  const storeLinks = [...story.matchAll(/<a class="store-link" href="([^"]+)" [^>]*rel="([^"]+)"[^>]*>[^<]*<\/a>(<p class="commission-notice">We may earn a commission<\/p>)?/g)];
  const linkRoute = (storeUrl) => `https://api.nobi.ai/v1/shop/story-go?url=${encodeURIComponent(storeUrl)}&amp;page=black-leather-boots`;

  assert.deepEqual(storeLinks.map(([, href, rel, notice]) => [href, rel, Boolean(notice)]), [
    [linkRoute("https://lucchese.com/products/roper?variant=123"), "sponsored nofollow noopener", true],
    [linkRoute("https://example.com/products/cowboy"), "nofollow noopener", false],
    [linkRoute("https://frye.example/products/harness"), "nofollow noopener", false],
  ]);
  const storyLinks = readFixturePageData().pages[0].products.map((product) => product.storyStoreLink).filter(Boolean);
  assert.ok(storyLinks.every((link) => !story.includes(encodeURIComponent(link)) && !story.includes(link.replaceAll("&", "&amp;"))));
});

test("a hostile product name is escaped everywhere and its embedded data reads back unchanged", () => {
  const html = readOutput("shop/s/black-leather-boots.html");
  const hostileName = '<script>alert("boot")</script> & "Cowboy" $& Boot';

  assert.ok(!html.includes('<script>alert("boot")'));
  assert.ok(!html.includes("<b>"));
  assert.ok(readBody(html).includes("&lt;script&gt;alert(&quot;boot&quot;)&lt;/script&gt; &amp; &quot;Cowboy&quot; $&amp; Boot"));

  const content = readScriptJson(html, "shop-nobi-prebuilt-content");
  assert.deepEqual([content.kind, content.path], ["search-page", "/shop/s/black-leather-boots"]);
  assert.equal(content.data.products[1].name, hostileName);
  assert.equal(content.data.query, "black leather boots");
  assert.ok(html.indexOf('id="shop-nobi-prebuilt-content"') < html.indexOf("readNobiAssistantOptions"), "The data comes before the bundle starts");
});

test("a page with enough guide text and pictures gets one web story file, and thin pages get none", () => {
  const story = readOutput("shop/stories/black-leather-boots.html");
  assert.ok(story.includes('<link rel="canonical" href="https://nobi.ai/shop/stories/black-leather-boots">'));
  assert.ok(story.includes("Leather &lt;boots&gt; last for years with care.") && story.includes("Harness Boot"));
  assert.deepEqual(readdirSync(join(distDir, "shop/stories")), ["black-leather-boots.html"]);
});

test("retired pages redirect permanently, except ones that are live again or have unsafe targets", () => {
  const redirects = readOutput("_redirects");
  assert.ok(redirects.startsWith(readOriginal("_redirects").trimEnd()));
  assert.match(redirects, /^\/shop\/s\/neon-boots \/shop\/s\/black-leather-boots 301$/m);
  assert.match(redirects, /^\/shop\/s\/old-boots \/shop 301$/m);
  assert.ok(!redirects.includes("/shop/s/chelsea-boots /shop"));
  assert.ok(!redirects.includes("bad-target") && !redirects.includes("evil"));
});

test("the Shop Nobi sitemap lists each built category page, search page and web story", () => {
  const shopSitemap = readOutput("sitemap-shop.xml");
  for (const path of ["shop/s/black-leather-boots", "shop/c/shoes", "shop/stories/black-leather-boots"]) {
    assert.ok(shopSitemap.includes(`<loc>https://nobi.ai/${path}</loc>\n    <lastmod>2026-10-11T08:02:11Z</lastmod>`), path);
  }
  assert.equal(shopSitemap.split("<url>").length - 1, 5, "One category page, three search pages and one story");
  assert.equal(shopSitemap.split("<lastmod>").length - 1, 5, "Every entry has a lastmod");
  assert.ok(!shopSitemap.includes("neon-boots"));
});

test("a sitemap entry without a valid refresh time gets the fallback time as its lastmod", () => {
  const pages = [null, "", "October 11", "2026-10-11T08:02:11Z"].map((refreshedAt, index) => ({ slug: `page-${index}`, refreshedAt }));
  const sitemap = buildShopNobiSitemap([], pages, [], "2026-10-12T08:10:00Z");
  const lastModifiedTimes = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(([, time]) => time);
  assert.deepEqual(lastModifiedTimes, ["2026-10-12T08:10:00Z", "2026-10-12T08:10:00Z", "2026-10-12T08:10:00Z", "2026-10-11T08:02:11Z"]);
});

test("the pin feed uses specific eligible product copy and leaves the canonical pages and board routes intact", () => {
  const feed = readOutput("shop/pins.xml");
  const items = feed.split("<item>").slice(1);
  const links = items.map((item) => item.match(/<link>https:\/\/nobi\.ai\/shop\/s\/([^<]+)<\/link>/)[1]);
  assert.deepEqual(links, ["black-leather-boots", "chelsea-boots"], "The boots page has no products, so no picture and no item");
  for (const line of [
    "<title>Roper Boot | black leather boots</title>",
    "<description>#ad We may earn a commission from some links on this page. Explore black leather boots. Pictured: Roper Boot from Lucchese. Compare listed options on Shop Nobi and buy directly from the store.</description>",
    '<guid isPermaLink="true">https://nobi.ai/shop/s/black-leather-boots</guid>',
    '<media:content url="https://cdn.example.com/roper.jpg" medium="image"/>',
  ]) {
    assert.ok(items[0].includes(line), `Missing: ${line}`);
  }
  assert.ok(items[1].includes("<description>Explore chelsea boots. Pictured: Chelsea Boot from Blundstone. Compare listed options on Shop Nobi and buy directly from the store.</description>"), "The non-affiliate item remains eligible without a commission claim");
  assert.deepEqual(readOutput("shop/pins/apparel-accessories.xml").split("<item>").slice(1), items, "All are apparel pages");
});

test("llms.txt keeps its own text and gains a Shop Nobi section with links to the pages", () => {
  const llmsText = readOutput("llms.txt");
  assert.ok(llmsText.startsWith(readOriginal("llms.txt").trimEnd()));
  assert.ok(llmsText.includes("## Shop Nobi"));
  assert.ok(llmsText.includes("- [Black Leather Boots](https://nobi.ai/shop/s/black-leather-boots)"));
});

test("when the file limit is reached, category room comes first and unbuilt pages stay out of static listings", async () => {
  const folder = makeDistCopy();
  const categoryAndOnePage = 2;
  try {
    const count = await prerenderWith({}, folder, { fileLimit: FileCountBeforePages + categoryAndOnePage });
    assert.equal(count, 1);
    assert.ok(!existsSync(join(folder, "shop/c/shoes.html")), "One built search page is too few for a category page");
    assert.ok(existsSync(join(folder, "shop/s/black-leather-boots.html")));
    assert.ok(!existsSync(join(folder, "shop/s/chelsea-boots.html")) && !existsSync(join(folder, "shop/s/boots.html")));
    const storyFiles = readdirSync(join(folder, "shop/stories"));
    assert.deepEqual(storyFiles, ["black-leather-boots.html"], "The story gets the room the category page did not need");

    const sitemap = readFileSync(join(folder, "sitemap-shop.xml"), "utf8");
    const llmsText = readFileSync(join(folder, "llms.txt"), "utf8");
    assert.equal(sitemap.split("<url>").length - 1, 2, "One search page and its story");
    assert.ok(!llmsText.includes("chelsea-boots") && !llmsText.includes("/shop/s/boots)"));

    const body = readBody(readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8"));
    assert.ok(!body.includes('href="/shop/s/'), "No links to pages that were left out");
    assert.ok(body.includes(">Boots</li>"), "An unbuilt breadcrumb stays as plain text");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("each category with enough search pages gets one page listing them, with its own head and breadcrumbs", () => {
  assert.ok(!existsSync(join(distDir, "shop/c/shoes")), "One file per category page");
  const html = readOutput("shop/c/shoes.html");
  const description = "Popular Shoes searches on Shop Nobi, the best products from the best stores online. You buy directly from the store.";
  for (const tag of [
    "<title>Shoes | Shop Nobi</title>",
    `<meta name="description" content="${description}">`,
    '<link rel="canonical" href="https://nobi.ai/shop/c/shoes">',
    '<meta name="robots" content="index, follow, max-image-preview:large">',
  ]) {
    assert.ok(html.includes(tag), `Missing tag: ${tag}`);
  }

  const [breadcrumbs] = readScriptJson(html, "page-schema");
  assert.deepEqual(breadcrumbs.itemListElement.map((crumb) => crumb.item), ["https://nobi.ai/shop", "https://nobi.ai/shop/c/shoes"]);

  const body = readBody(html);
  assert.ok(body.includes('<h1 class="mt-4 text-3xl font-semibold">Shoes</h1>'));
  const searchLinks = [...body.matchAll(/<a href="(\/shop\/s\/[^"]+)" class="hover:underline">([^<]+)<\/a>/g)].map(([, href, title]) => [href, title]);
  const expectedLinks = [["/shop/s/black-leather-boots", "Black Leather Boots"], ["/shop/s/chelsea-boots", "Chelsea Boots"], ["/shop/s/boots", "Boots"]];
  assert.deepEqual(searchLinks, expectedLinks);
});

test("/shop lists the category pages and the most searched pages until the live search arrives", () => {
  const html = readOutput("shop.html");
  assert.equal(html, readOutput("shop/index.html"));
  const body = readBody(html);
  assert.ok(body.includes('<h2 class="mt-8 text-lg font-semibold">Popular searches</h2>'));
  assert.ok(body.includes('<a href="/shop/c/shoes" class="hover:underline">Shoes</a>'));
  const slugs = ["black-leather-boots", "chelsea-boots", "boots"];
  assert.ok(slugs.every((slug) => body.includes(`<a href="/shop/s/${slug}" class="hover:underline">`)));
  assert.ok(!body.includes("Loading Shop Nobi"));
  assert.equal(readScriptJson(html, "shop-nobi-prebuilt-content").kind, "popular-searches");
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

/** Builds search pages under one furniture category, which the build can render. */
function buildFurniturePages(count, categoryName, slugPrefix) {
  return Array.from({ length: count }, (_, index) => ({
    slug: `${slugPrefix}-${index}`,
    title: `${categoryName} ${index}`,
    categoryPath: `furniture.${slugPrefix}`,
    breadcrumbs: [{ name: categoryName, slug: null }],
    products: [],
  }));
}

test("a top category's page shows its category pages under Browse by category, then its own search pages", async () => {
  const chairs = buildFurniturePages(3, "Chairs", "chair");
  const benches = buildFurniturePages(2, "Benches", "bench");
  const ottomans = buildFurniturePages(1, "Ottomans", "ottoman");
  const folder = makeDistCopy();
  try {
    await prerenderWith({ body: { generatedAt: new Date().toISOString(), pages: [...chairs, ...benches, ...ottomans], retired: [] } }, folder);

    const body = readBody(readFileSync(join(folder, "shop/c/furniture.html"), "utf8"));
    const links = [...body.matchAll(/href="(\/shop\/[cs]\/[^"]+)"/g)].map(([, href]) => href);
    assert.ok(body.includes("Browse by category"));
    assert.deepEqual(links, ["/shop/c/chairs", "/shop/s/bench-0", "/shop/s/bench-1", "/shop/s/ottoman-0"]);
    assert.ok(!readBody(readFileSync(join(folder, "shop/c/chairs.html"), "utf8")).includes("Browse by category"));
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
