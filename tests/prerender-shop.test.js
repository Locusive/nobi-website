import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { countRedirectRules } from "../scripts/shop-nobi-search-page-listings.js";
import { FileCountBeforePages, makeDistCopy, prerenderWith, readBody, readOriginal, readScriptJson } from "./shop-nobi-test-build.js";

let distDir;

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
  assert.deepEqual(products.map((product) => product.name), ["Roper Boot", '<script>alert("boot")</script> & "Cowboy" $& Boot', "Harness Boot"]);
  assert.deepEqual(products[0].brand, { "@type": "Brand", name: "Lucchese" });
  const roperUrl = "https://lucchese.com/products/roper?variant=123";
  const roperOffer = { "@type": "Offer", price: 495, priceCurrency: "USD", availability: "https://schema.org/InStock", url: roperUrl };
  assert.deepEqual(products[0].offers, roperOffer);
  assert.equal(products[1].offers.availability, "https://schema.org/OutOfStock");
  assert.equal(products[1].image, undefined, "A javascript: picture address is dropped");

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
  assert.equal(productLinks.length, 3, "The product with a javascript: link is dropped");
  for (const [, href, attributes] of productLinks) {
    assert.ok(attributes.includes('target="_blank"'), href);
    assert.ok(!href.includes("utm_"), href);
  }
  assert.ok(!body.includes("javascript:"));
  assert.ok(!body.includes("Loading Shop Nobi"));
});

test("the first breadcrumb links to its category page, and other breadcrumb and related links only to built pages", () => {
  const body = readBody(readOutput("shop/s/black-leather-boots.html"));
  const pageLinks = [...body.matchAll(/href="(\/shop[^"]*)"/g)].map(([, href]) => href);
  assert.deepEqual(pageLinks, ["/shop", "/shop", "/shop/c/shoes", "/shop/s/boots", "/shop/stories/black-leather-boots", "/shop/s/chelsea-boots"]);

  const bootsBody = readBody(readOutput("shop/s/boots.html"));
  assert.ok(bootsBody.includes('<a href="/shop/c/shoes" class="hover:underline">Shoes</a>'), "Even when the crumb has no search page");
  assert.ok(!readBody(readOutput("shop/s/chelsea-boots.html")).includes('href="/shop/c/'), "No breadcrumbs, no category link");
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

test("a paid product keeps its plain link for crawlers, with rel=sponsored and a Paid link label beside it", () => {
  const html = readOutput("shop/s/black-leather-boots.html");
  const body = readBody(html);
  const productLinks = [...body.matchAll(/<a href="(https?:[^"]+)" rel="([^"]+)"/g)].map(([, href, rel]) => [href, rel]);

  assert.deepEqual(productLinks, [
    ["https://lucchese.com/products/roper?variant=123", "sponsored nofollow noopener"],
    ["https://example.com/products/cowboy", "nofollow noopener"],
    ["https://frye.example/products/harness", "nofollow noopener"],
  ]);
  assert.equal(body.split(">Paid link</p>").length - 1, 1, "Only the paid product is labeled");
  assert.ok(body.indexOf(">Paid link</p>") < body.indexOf("$495.00"), "The label sits with the paid product");
  assert.ok(!readBody(readOutput("shop/s/chelsea-boots.html")).includes("Paid link"), "An unpaid finished link gets no label");

  const products = readScriptJson(html, "shop-nobi-prebuilt-content").data.products;
  assert.ok(products[0].storeLink.startsWith("https://sovrn.co?key=web&u=https%3A%2F%2Flucchese.com"), "The click opens the finished link as sent");
  assert.deepEqual([products[1].storeLink, products[1].paidLink], [null, false], "An unsafe finished link is dropped and never called paid");
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
  assert.ok(!shopSitemap.includes("neon-boots"));
});

test("the pin feed and its category feed have one item per search page with an https picture, newest first", () => {
  const feed = readOutput("shop/pins.xml");
  const items = feed.split("<item>").slice(1);
  const links = items.map((item) => item.match(/<link>https:\/\/nobi\.ai\/shop\/s\/([^<]+)<\/link>/)[1]);
  assert.deepEqual(links, ["black-leather-boots", "chelsea-boots"], "The boots page has no products, so no picture and no item");
  for (const line of [
    "<title>Black Leather Boots</title>",
    "<description>Black leather boots for work &amp; weekends, from &quot;classic&quot; ropers to &lt;lace-ups&gt;.</description>",
    '<guid isPermaLink="true">https://nobi.ai/shop/s/black-leather-boots</guid>',
    '<media:content url="https://cdn.example.com/roper.jpg" medium="image"/>',
  ]) {
    assert.ok(items[0].includes(line), `Missing: ${line}`);
  }
  assert.deepEqual(readOutput("shop/pins/apparel-accessories.xml").split("<item>").slice(1), items, "All are apparel pages");
});

test("llms.txt keeps its own text and gains a Shop Nobi section with links to the pages", () => {
  const llmsText = readOutput("llms.txt");
  assert.ok(llmsText.startsWith(readOriginal("llms.txt").trimEnd()));
  assert.ok(llmsText.includes("## Shop Nobi"));
  assert.ok(llmsText.includes("- [Black Leather Boots](https://nobi.ai/shop/s/black-leather-boots)"));
});

test("when the file limit is reached, category pages come first, then the first search pages, and the rest stay out of every listing", async () => {
  const folder = makeDistCopy();
  const categoryAndOnePage = 2;
  try {
    const count = await prerenderWith({}, folder, { fileLimit: FileCountBeforePages + categoryAndOnePage });
    assert.equal(count, 1);
    const categoryBody = readBody(readFileSync(join(folder, "shop/c/shoes.html"), "utf8"));
    assert.ok(categoryBody.includes('href="/shop/s/black-leather-boots"') && !categoryBody.includes('href="/shop/s/boots"'));
    assert.ok(existsSync(join(folder, "shop/s/black-leather-boots.html")));
    assert.ok(!existsSync(join(folder, "shop/s/chelsea-boots.html")) && !existsSync(join(folder, "shop/s/boots.html")));
    assert.ok(!existsSync(join(folder, "shop/stories")), "Stories get only the room left after the pages");

    const sitemap = readFileSync(join(folder, "sitemap-shop.xml"), "utf8");
    const llmsText = readFileSync(join(folder, "llms.txt"), "utf8");
    assert.equal(sitemap.split("<url>").length - 1, 2, "The category page and one search page");
    assert.ok(!llmsText.includes("chelsea-boots") && !llmsText.includes("/shop/s/boots)"));

    const body = readBody(readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8"));
    assert.ok(!body.includes('href="/shop/s/'), "No links to pages that were left out");
    assert.ok(body.includes(">Boots</li>") && body.includes("Chelsea Boots</li>"), "They show as plain text");
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});

test("each top category gets one page listing its search pages, with its own head and breadcrumbs", () => {
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
  assert.deepEqual(searchLinks, [["/shop/s/black-leather-boots", "Black Leather Boots"], ["/shop/s/boots", "Boots"]]);
  assert.ok(!existsSync(join(distDir, "shop/c/chelsea-boots.html")), "A page without breadcrumbs gets no category page");
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
