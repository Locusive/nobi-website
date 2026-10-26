import assert from "node:assert/strict";
import { test } from "node:test";
import { linkWebStories, planWebStories, planWebStory } from "../scripts/shop-nobi-web-story-plan.js";
import { renderWebStory } from "../scripts/shop-nobi-web-story.js";
import { PortraitPosterSize } from "../src/utils/previewImage.js";

const ShopifyPicture = "https://cdn.shopify.com/s/files/1/0001/boot.jpg?v=1";
const PortraitPoster = "https://cdn.shopify.com/s/files/1/0001/boot.jpg?v=1&width=640&height=853&crop=center";
const WidePicture = "https://cdn.shopify.com/s/files/1/0001/boot.jpg?v=1&width=1200";

/** Gives every picture the full poster size. */
async function readFullSize() {
  return PortraitPosterSize;
}

/** Plans and renders a page's story, with every poster at full size. */
async function renderStory(page) {
  const { stories } = await planWebStories([page], 1, readFullSize);
  return renderWebStory(page, stories[0].plan);
}

/** Builds a search page with enough guide text, pictures and questions for a story, with the given changes. */
function makePage(changes = {}) {
  const products = ["Roper", "Chelsea", "Harness", "Combat"].map((name) => ({
    name: `${name} Boot`,
    storeName: "Boot Store",
    url: `https://store.example/products/${name.toLowerCase()}?variant=1`,
    imageUrl: ShopifyPicture,
    price: 200,
    currency: "USD",
  }));
  return {
    slug: "boots",
    title: "Boots",
    description: "Boots for every day.",
    categoryPath: "apparel_accessories.shoes.boots",
    refreshedAt: "2026-10-11T08:02:11Z",
    updatedDate: "October 11, 2026",
    guide: ["Leather boots last for years.", "Pick a pair that fits your week."],
    faq: [{ question: "Are boots waterproof?", answer: "Most need wax." }],
    products,
    ...changes,
  };
}

/** Reads the value of an attribute on the first element with the given tag. */
function readAttribute(html, tag, attribute) {
  const element = html.match(new RegExp(`<${tag}\\b[^>]*>`))[0];
  return element.match(new RegExp(`\\s${attribute}="([^"]*)"`))?.[1];
}

test("a story has a cover, the guide, up to three products, questions that fit, and a last page", () => {
  const plan = planWebStory(makePage());

  assert.deepEqual(plan.pages.map((page) => page.kind), ["cover", "guide", "guide", "product", "product", "product", "question", "end"]);
  assert.deepEqual(plan.posterCandidates, [PortraitPoster], "The poster is a 3:4 portrait cut, listed once");
  assert.equal(plan.pages[3].product.imageUrl, WidePicture, "Product pictures are asked for at 1,200 pixels wide");
});

test("long guide text is split into whole sentences of at most 180 characters, and a story stops at 10 pages", () => {
  const sentence = "Good boots are made of leather and last for years.";
  const longParagraph = Array(18).fill(sentence).join(" ");
  const longAnswer = { question: "Too long?", answer: "x".repeat(180) };
  const plan = planWebStory(makePage({ guide: [longParagraph], faq: [longAnswer, ...Array(5).fill(makePage().faq[0])] }));
  const guideTexts = plan.pages.filter((page) => page.kind === "guide").map((page) => page.text);

  assert.equal(guideTexts.length, 4, "The guide is held to four pages");
  assert.ok(guideTexts.every((text) => text.length <= 180 && text.endsWith(".")));
  assert.equal(plan.pages.length, 10);
  assert.ok(!plan.pages.some((page) => page.question === "Too long?"), "A question that does not fit one page is left out");
});

test("a page without enough guide text, product pictures or a Shopify poster gets no story", () => {
  const httpPicture = (product) => ({ ...product, imageUrl: "http://cdn.shopify.com/boot.jpg" });
  const otherHost = (product) => ({ ...product, imageUrl: "https://cdn.example.com/boot.jpg" });
  const fullPage = makePage();

  assert.equal(planWebStory(makePage({ guide: ["Only one short paragraph."] })), null);
  assert.equal(planWebStory(makePage({ products: [fullPage.products[0], httpPicture(fullPage.products[1])] })), null);
  assert.equal(planWebStory(makePage({ products: fullPage.products.map(otherHost) })), null);
  assert.ok(planWebStory(makePage({ faq: [] })), "Questions are not required");
});

test("mature pages get no story, and stories stop at the limit in page order", async () => {
  const pages = [
    makePage({ slug: "knives", categoryPath: "mature.weapons" }),
    makePage({ slug: "rifles", categoryPath: " Mature.weapons.guns" }),
    makePage({ slug: "thin", guide: [] }),
    makePage({ slug: "first" }),
    makePage({ slug: "second" }),
    makePage({ slug: "third" }),
  ];
  const { stories, leftOutCount } = await planWebStories(pages, 2, readFullSize);

  assert.deepEqual(stories.map((story) => story.page.slug), ["first", "second"]);
  assert.equal(leftOutCount, 1, "Only pages that could have had a story count as left out");
  const linkedPages = linkWebStories(pages, stories);
  assert.deepEqual(linkedPages.map((page) => page.storyPath), [null, null, null, "/shop/stories/first", "/shop/stories/second", null]);
});

test("a picture too small for a full poster is skipped for the next one, and a page with none gets no story", async () => {
  const smallPicture = "https://cdn.shopify.com/small.jpg";
  const products = makePage().products.map((product, index) => ({ ...product, imageUrl: index === 0 ? smallPicture : ShopifyPicture }));
  const sizeByUrl = { [PortraitPoster]: PortraitPosterSize, [`${smallPicture}?width=640&height=853&crop=center`]: { width: 600, height: 600 } };
  const readSize = async (imageUrl) => sizeByUrl[imageUrl] ?? null;
  const pages = [makePage({ slug: "small-first", products }), makePage({ slug: "all-small", products: [products[0], products[0]] })];

  const { stories, smallPosterCount } = await planWebStories(pages, 5, readSize);
  assert.deepEqual(stories.map((story) => [story.page.slug, story.plan.posterUrl]), [["small-first", PortraitPoster]]);
  assert.equal(smallPosterCount, 1);
  const unreadable = await planWebStories([makePage()], 1, async () => null);
  assert.equal(unreadable.stories.length, 0, "A picture whose size cannot be read is never a poster");
});

test("the story is an AMP story with the metadata Google requires and a canonical address of its own", async () => {
  const html = await renderStory(makePage());

  assert.ok(html.startsWith('<!doctype html>\n<html amp lang="en">'));
  assert.ok(html.includes('<link rel="canonical" href="https://nobi.ai/shop/stories/boots">'));
  assert.ok(html.includes('<meta name="robots" content="index, follow, max-image-preview:large">'));
  assert.ok(html.includes("<style amp-boilerplate>") && html.includes('custom-element="amp-story"'));
  assert.match(html, /<amp-story standalone /);
  assert.equal(readAttribute(html, "amp-story", "title"), "Boots");
  assert.equal(readAttribute(html, "amp-story", "publisher"), "Nobi");
  assert.equal(readAttribute(html, "amp-story", "publisher-logo-src"), "https://nobi.ai/shop-nobi-story-logo.png");
  assert.equal(readAttribute(html, "amp-story", "poster-portrait-src"), PortraitPoster.replaceAll("&", "&amp;"));
  assert.equal(html.split("<amp-story-page ").length - 1, 8);
});

test("store links are nofollow and untagged, and the last page links back to the search page with the story's tags", async () => {
  const html = await renderStory(makePage());
  const links = [...html.matchAll(/<a\b([^>]*)>/g)].map(([, attributes]) => attributes);
  const storeLinks = links.filter((attributes) => attributes.includes("store.example"));
  const backLinks = links.filter((attributes) => attributes.includes("nobi.ai/shop"));

  assert.equal(storeLinks.length, 3);
  assert.ok(storeLinks.every((attributes) => attributes.includes('rel="nofollow noopener"') && !attributes.includes("utm_")));
  const backLink = "https://nobi.ai/shop/s/boots?utm_source=google_web_stories&amp;utm_medium=referral&amp;utm_campaign=shop_nobi";
  assert.deepEqual(backLinks, [` href="${backLink}"`]);
  assert.match(html, /<amp-story-page-outlink layout="nodisplay"><a href="[^"]+">[^<]+<\/a><\/amp-story-page-outlink>\n<\/amp-story-page>\n<\/amp-story>/);
});

test("the sofas story invites a real search while retaining its product links", async () => {
  const html = await renderStory(makePage({ slug: "sofas", title: "Sofas" }));
  const links = [...html.matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)];
  const storeLinks = links.filter(([, attributes]) => attributes.includes("store.example"));
  const searchLink = links.find(([, attributes]) => attributes.includes("nobi.ai/shop?"));

  assert.equal(storeLinks.length, 3);
  assert.ok(storeLinks.every(([, attributes]) => attributes.includes('rel="nofollow noopener"')));
  assert.deepEqual(searchLink?.slice(1), [
    ' href="https://nobi.ai/shop?utm_source=google_web_stories&amp;utm_medium=referral&amp;utm_campaign=story_to_search&amp;utm_content=sofas"',
    "Search for your sofa",
  ]);
  assert.match(html, /Search Shop Nobi for the style, size and budget you want/);
  assert.ok(!html.includes("/shop?q="), "The landing must wait for a visitor-entered search");
});

test("a store link goes through the API, which counts the tap and adds its conversation, and its tooltip names the store", async () => {
  const html = await renderStory(makePage());
  const firstStoreLink = [...html.matchAll(/<a class="store-link"([^>]*)>/g)][0][1];

  const linkThroughApi = "https://api.nobi.ai/v1/shop/story-go?url=https%3A%2F%2Fstore.example%2Fproducts%2Froper%3Fvariant%3D1&amp;page=boots";
  assert.ok(firstStoreLink.includes(` href="${linkThroughApi}"`), firstStoreLink);
  assert.ok(firstStoreLink.includes(' data-tooltip-text="store.example"'), firstStoreLink);
  assert.ok(!html.includes("story-click-through"), "The API counts the tap, so no beacon counts it twice");
});

test("each page in view goes to the API, and a product page's id names its place, product and store", async () => {
  const productIds = [
    { productVariantId: "8e4a3b21-1d55-4c2b-9b86-3a7f2a6e0003", owningMerchantId: "35019f05-f0cd-4ee3-ba16-c1fe938888d1" },
    {},
    { productVariantId: "f9e26080-b6a4-4af2-b32c-b6e751e976c6", owningMerchantId: "35019f05-f0cd-4ee3-ba16-c1fe938888d1" },
  ];
  const page = makePage();
  const html = await renderStory({ ...page, products: page.products.map((product, index) => ({ ...product, ...productIds[index] })) });

  const config = JSON.parse(html.match(/<amp-analytics><script type="application\/json">(.*?)<\/script><\/amp-analytics>/)[1]);
  assert.deepEqual(config, {
    requests: { storyView: "https://api.nobi.ai/v1/shop/story-view?page=boots&storyPage=${storyPageId}" },
    triggers: { pageInView: { on: "story-page-visible", request: "storyView" } },
    transport: { beacon: true, xhrpost: true, image: false },
  });
  assert.ok(html.includes('custom-element="amp-analytics"'));
  const pageIds = [...html.matchAll(/<amp-story-page id="([^"]+)">/g)].map(([, id]) => id);
  assert.deepEqual(pageIds.filter((id) => id.startsWith("product")), [
    "product-1-8e4a3b21-1d55-4c2b-9b86-3a7f2a6e0003-35019f05-f0cd-4ee3-ba16-c1fe938888d1",
    "product-5",
    "product-3-f9e26080-b6a4-4af2-b32c-b6e751e976c6-35019f05-f0cd-4ee3-ba16-c1fe938888d1",
  ], "A product the API sent no ids for keeps its plain id, which the API ignores");
});

test("page text is escaped everywhere it appears", async () => {
  const hostile = '<script>alert("boot")</script> & Boots';
  const html = await renderStory(makePage({ title: hostile, guide: [hostile, "Second paragraph."] }));

  assert.ok(!html.includes("<script>alert"));
  assert.ok(html.includes("<title>&lt;script&gt;alert(&quot;boot&quot;)&lt;/script&gt; &amp; Boots</title>"));
});

test("story links and product impressions retain known placement and affiliate destination independently", async () => {
  for (const placementReason of ["affiliate", "paid_merchant", "organic", undefined, "Boost"]) {
    for (const storyPaidLink of [true, false, undefined]) {
      const page = makePage();
      page.products[0] = { ...page.products[0], productVariantId: "variant-id", owningMerchantId: "store-id",
        paidLink: true, storyPaidLink, placementReason };
      const html = await renderStory(page);
      const knownReason = ["affiliate", "paid_merchant", "organic"].includes(placementReason);
      const suffix = typeof storyPaidLink === "boolean"
        ? `-${storyPaidLink ? "affiliate" : "direct"}-${knownReason ? placementReason : "unknown"}` : "";
      assert.ok(html.includes(`id="product-1-variant-id-store-id${suffix}"`));
      const firstLink = [...html.matchAll(/<a class="store-link" href="([^"]+)"([^>]+)>/g)][0];
      const address = new URL(firstLink[1].replaceAll("&amp;", "&"));
      assert.equal(address.searchParams.get("placementReason"), knownReason ? placementReason : null);
      assert.equal(address.searchParams.get("url"), page.products[0].url);
      assert.equal(address.searchParams.get("page"), page.slug);
      assert.equal(firstLink[2].includes("sponsored"), storyPaidLink !== false);
    }
  }
});
