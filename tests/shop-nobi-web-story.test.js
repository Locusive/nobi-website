import assert from "node:assert/strict";
import { test } from "node:test";
import { linkWebStories, planWebStories, planWebStory } from "../scripts/shop-nobi-web-story-plan.js";
import { renderWebStory } from "../scripts/shop-nobi-web-story.js";

const ShopifyPicture = "https://cdn.shopify.com/s/files/1/0001/boot.jpg?v=1";
const PortraitPoster = "https://cdn.shopify.com/s/files/1/0001/boot.jpg?v=1&width=640&height=853&crop=center";
const WidePicture = "https://cdn.shopify.com/s/files/1/0001/boot.jpg?v=1&width=1200";

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
  assert.equal(plan.posterUrl, PortraitPoster, "The poster is a 3:4 portrait cut");
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

test("mature pages get no story, and stories stop at the limit in page order", () => {
  const pages = [
    makePage({ slug: "knives", categoryPath: "mature.weapons" }),
    makePage({ slug: "rifles", categoryPath: " Mature.weapons.guns" }),
    makePage({ slug: "thin", guide: [] }),
    makePage({ slug: "first" }),
    makePage({ slug: "second" }),
    makePage({ slug: "third" }),
  ];
  const { stories, leftOutCount } = planWebStories(pages, 2);

  assert.deepEqual(stories.map((story) => story.page.slug), ["first", "second"]);
  assert.equal(leftOutCount, 1, "Only pages that could have had a story count as left out");
  const linkedPages = linkWebStories(pages, stories);
  assert.deepEqual(linkedPages.map((page) => page.storyPath), [null, null, null, "/shop/stories/first", "/shop/stories/second", null]);
});

test("the story is an AMP story with the metadata Google requires and a canonical address of its own", () => {
  const page = makePage();
  const html = renderWebStory(page, planWebStory(page));

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

test("store links are nofollow and untagged, and the last page links back to the search page with the story's tags", () => {
  const page = makePage();
  const html = renderWebStory(page, planWebStory(page));
  const links = [...html.matchAll(/<a\b([^>]*)>/g)].map(([, attributes]) => attributes);
  const storeLinks = links.filter((attributes) => attributes.includes("store.example"));
  const backLinks = links.filter((attributes) => attributes.includes("nobi.ai"));

  assert.equal(storeLinks.length, 3);
  assert.ok(storeLinks.every((attributes) => attributes.includes('rel="nofollow noopener"') && !attributes.includes("utm_")));
  const backLink = "https://nobi.ai/shop/s/boots?utm_source=google_web_stories&amp;utm_medium=referral&amp;utm_campaign=shop_nobi";
  assert.deepEqual(backLinks, [` href="${backLink}"`]);
  assert.match(html, /<amp-story-page-outlink layout="nodisplay"><a href="[^"]+">[^<]+<\/a><\/amp-story-page-outlink>\n<\/amp-story-page>\n<\/amp-story>/);
});

test("page text is escaped everywhere it appears", () => {
  const hostile = '<script>alert("boot")</script> & Boots';
  const page = makePage({ title: hostile, guide: [hostile, "Second paragraph."] });
  const html = renderWebStory(page, planWebStory(page));

  assert.ok(!html.includes("<script>alert"));
  assert.ok(html.includes("<title>&lt;script&gt;alert(&quot;boot&quot;)&lt;/script&gt; &amp; Boots</title>"));
});
