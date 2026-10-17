import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPinFeedFiles, listPinFeedFiles } from "../scripts/shop-nobi-pin-feed.js";
import { PinBoardNameByTopLevel } from "../src/utils/shopNobiPinBoard.js";

/** Builds a search page with one product per picture address. */
function makePage(slug, refreshedAt, imageUrls, categoryPath = null) {
  const products = imageUrls.map((imageUrl) => ({ name: "Boot", url: "https://store.example/boot", imageUrl }));
  return { slug, title: slug, description: null, categoryPath, refreshedAt, breadcrumbs: [], faq: [], products };
}

/** Builds a page with a picture under the given category path. */
function makeCategoryPage(slug, categoryPath) {
  return makePage(slug, "2026-10-11T00:00:00Z", [`https://cdn.example/${slug}.jpg`], categoryPath);
}

/** Returns the content of the feed file at the given path. */
function readFeedFile(files, path) {
  const file = files.find((candidate) => candidate.path === path);
  assert.ok(file, `Missing file ${path}`);
  return file.content;
}

/** Reads the page links of the feed's items, in order. */
function readItemLinks(feed) {
  return [...feed.matchAll(/<item>\s*<title>[^<]*<\/title>\s*<link>([^<]+)<\/link>/g)].map(([, link]) => link.split("/").pop());
}

test("the feed puts the most recently refreshed pages first, whatever the data order, and dates no item", () => {
  const pages = [
    makePage("oldest", "2026-10-01T00:00:00Z", ["https://cdn.example/a.jpg"]),
    makePage("no-date", null, ["https://cdn.example/b.jpg"]),
    makePage("newest", "2026-10-11T00:00:00Z", ["https://cdn.example/c.jpg"]),
  ];
  const feed = readFeedFile(buildPinFeedFiles(pages), "shop/pins.xml");
  assert.deepEqual(readItemLinks(feed), ["newest", "oldest", "no-date"]);
  assert.ok(!feed.includes("<pubDate>"), "A nightly refresh is not a publish date");
});

test("the feed uses the first https picture, skips pages without one, and stops at the limit", () => {
  const pages = [
    makePage("http-then-https", "2026-10-11T00:00:00Z", ["http://cdn.example/plain.jpg", "https://cdn.example/secure.jpg"]),
    makePage("http-only", "2026-10-10T00:00:00Z", ["http://cdn.example/plain.jpg"]),
    makePage("second", "2026-10-09T00:00:00Z", ["https://cdn.example/d.jpg"]),
    makePage("third", "2026-10-08T00:00:00Z", ["https://cdn.example/e.jpg"]),
  ];
  const feed = readFeedFile(buildPinFeedFiles(pages, 2), "shop/pins.xml");
  assert.deepEqual(readItemLinks(feed), ["http-then-https", "second"]);
  assert.ok(feed.includes('<media:content url="https://cdn.example/secure.jpg" medium="image"/>'));
});

test("a Shopify picture is asked for at 1,200 pixels wide, keeping its other settings", () => {
  const pages = [
    makePage("shopify-cdn", "2026-10-11T00:00:00Z", ["https://cdn.shopify.com/s/files/1/boot.jpg?v=7&width=300"]),
    makePage("shopify-store", "2026-10-10T00:00:00Z", ["https://store.example/cdn/shop/files/boot.jpg?v=8"]),
  ];
  const feed = readFeedFile(buildPinFeedFiles(pages), "shop/pins.xml");
  assert.ok(feed.includes('url="https://cdn.shopify.com/s/files/1/boot.jpg?v=7&amp;width=1200"'));
  assert.ok(feed.includes('url="https://store.example/cdn/shop/files/boot.jpg?v=8&amp;width=1200"'));
});

test("a page lands only in its top level's feed, and pages with no or an unknown category land in none", () => {
  const pages = [
    makeCategoryPage("boots", "apparel_accessories.shoes.boots"),
    makeCategoryPage("sofas", "furniture.sofas"),
    makeCategoryPage("no-category", null),
    makeCategoryPage("unknown-category", "made_up.things"),
  ];
  const files = buildPinFeedFiles(pages);
  const apparelFeed = readFeedFile(files, "shop/pins/apparel-accessories.xml");

  assert.deepEqual(readItemLinks(apparelFeed), ["boots"]);
  assert.deepEqual(readItemLinks(readFeedFile(files, "shop/pins/furniture.xml")), ["sofas"]);
  assert.deepEqual(readItemLinks(readFeedFile(files, "shop/pins/electronics.xml")), [], "An empty board keeps its feed");
  assert.ok(apparelFeed.includes("<title>Shop Nobi: Apparel &amp; Accessories</title>"));
  assert.ok(apparelFeed.includes('<atom:link href="https://nobi.ai/shop/pins/apparel-accessories.xml" rel="self"'));

  const boardFeeds = files.filter((file) => file.path.endsWith(".xml") && file.path !== "shop/pins.xml");
  assert.ok(boardFeeds.every((file) => !file.content.includes("no-category") && !file.content.includes("unknown-category")));
  assert.deepEqual(readItemLinks(readFeedFile(files, "shop/pins.xml")), ["boots", "sofas", "no-category", "unknown-category"]);
});

test("mature pages land in no feed, the feed of all pages included, and no mature feed exists", () => {
  const pages = [
    makeCategoryPage("hunting-knives", "mature.weapons"),
    makeCategoryPage("rifles", " Mature.weapons.guns"),
    makeCategoryPage("boots", "apparel_accessories.shoes.boots"),
  ];
  const files = buildPinFeedFiles(pages);

  assert.deepEqual(readItemLinks(readFeedFile(files, "shop/pins.xml")), ["boots"]);
  assert.ok(files.every((file) => !file.path.includes("mature")));
  assert.ok(files.every((file) => !file.content.includes("hunting-knives") && !file.content.includes("rifles")));
});

test("the index lists every board feed with its address and item count, and each feed keeps the item limit", () => {
  const pages = [
    makeCategoryPage("boots", "apparel_accessories.shoes.boots"),
    makeCategoryPage("handbags", "apparel_accessories.handbags_wallets_cases.handbags"),
  ];
  const files = buildPinFeedFiles(pages, 1);
  const index = JSON.parse(readFeedFile(files, "shop/pins/index.json"));

  assert.equal(index.length, Object.keys(PinBoardNameByTopLevel).length);
  assert.deepEqual(index[0], {
    slug: "apparel-accessories",
    boardName: "Apparel & Accessories",
    feedUrl: "https://nobi.ai/shop/pins/apparel-accessories.xml",
    itemCount: 1,
  });
  assert.ok(index.slice(1).every((entry) => entry.itemCount === 0));
  assert.deepEqual(files.map((file) => file.path), listPinFeedFiles(), "The build counts exactly the files it writes");
});

/** Reads only the item descriptions, excluding the channel description. */
function readItemDescriptions(feed) {
  return [...feed.matchAll(/<item>[\s\S]*?<description>([\s\S]*?)<\/description>[\s\S]*?<\/item>/g)].map(([, description]) => description);
}

test("a mixed Cat Beds page discloses commission in both feeds without changing its identity or leading image", () => {
  const page = makeCategoryPage("cat-beds", "animals_pet_supplies.pet_supplies.cat_supplies.cat_beds");
  page.title = "Cat Beds & Cushions";
  page.description = "Compare cat beds & cushions <before buying>.";
  page.products.push({ name: "Kip Cat Bed", url: "https://tuftandpaw.com/products/kip-cushion", paidLink: true });
  const files = buildPinFeedFiles([page]);

  for (const path of ["shop/pins.xml", "shop/pins/animals-pet-supplies.xml"]) {
    const feed = readFeedFile(files, path);
    assert.deepEqual(readItemDescriptions(feed), [
      "We may earn a commission from some links on this page. Compare cat beds &amp; cushions &lt;before buying&gt;.",
    ]);
    assert.ok(feed.includes("<title>Cat Beds &amp; Cushions</title>"));
    assert.ok(feed.includes("<link>https://nobi.ai/shop/s/cat-beds</link>"));
    assert.ok(feed.includes('<guid isPermaLink="true">https://nobi.ai/shop/s/cat-beds</guid>'));
    assert.ok(feed.includes('<media:content url="https://cdn.example/cat-beds.jpg" medium="image"/>'));
    assert.ok(!feed.includes("<pubDate>"), "Commission disclosure must not invent publication dates");
  }
});

test("unpaid and unconfirmed product flags preserve the original escaped item descriptions", () => {
  const pages = [false, undefined, "true", "false"].map((paidLink, index) => {
    const page = makePage(`unpaid-${index}`, null, ["https://cdn.example/plain.jpg"]);
    page.description = "Compare beds & cushions <without a commission claim>.";
    page.products[0].paidLink = paidLink;
    return page;
  });
  const feed = readFeedFile(buildPinFeedFiles(pages), "shop/pins.xml");

  assert.deepEqual(readItemDescriptions(feed), pages.map(() => "Compare beds &amp; cushions &lt;without a commission claim&gt;."));
  assert.ok(!feed.includes("We may earn a commission"));
});
