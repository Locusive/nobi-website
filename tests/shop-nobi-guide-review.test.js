import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";
import { htmlEscape } from "../scripts/prerender-blog.js";

const ReviewedTopics = [
  ["green-polo", /care label/i],
  ["booties", /intended wearer/i],
  ["100-silk-clothing-accessories", /composition/i],
  ["washed-cotton-velvet-bing-cherry-decor", /furniture model/i],
  ["100-cashmere-clothing", /composition/i],
  ["100-cashmere-sweaters", /composition/i],
  ["100-cotton-underwear-socks", /composition/i],
  ["amplifier-cases", /cover/i],
  ["18k-white-gold-bangles", /diameter/i],
  ["kids-pink-baby-one-pieces", /convertible/i],
  ["mens-black-joggers", /antimicrobial/i],
  ["18k-mixed-gold-jewelry", /metal/i],
  ["18k-rose-gold-tennis-bracelets", /karat/i],
  ["14k-yellow-gold-jewelry", /white gold/i],
  ["womens-pearl-jewelry", /pearl/i],
  ["14k-rose-gold-bracelets-2", /magnet/i],
  ["18k-white-gold-stud-earrings", /weight/i],
  ["womens-rose-gold-jewelry", /plat/i],
  ["18k-rose-gold-bangles", /alloy/i],
  ["18k-rose-gold-earrings", /nickel-free/i],
  ["yellow-earrings", /stone/i],
  ["brown-work-boots", /toe/i],
  ["black-snowboard-boots", /binding/i],
  ["baby-dresses", /adult/i],
  ["brown-leather-jackets", /trim/i],
  ["brown-ankle-boots", /material/i],
  ["brown-knee-high-boots", /waterproof/i],
  ["brown-lifestyle-sneakers", /care/i],
  ["beige-maxi-dresses", /lining/i],
  ["blue-dress-pants", /care/i],
  ["blue-navy-sweaters", /weight/i],
  ["cutting-boards", /bamboo/i],
  ["blender-accessories", /holder/i],
  ["art-brushes", /artwork/i],
  ["bicycle-baskets", /mount/i],
  ["birch-sling-furniture-sets", /load limit/i],
  ["beige-barware-sets", /furniture/i],
  ["bathroom-cleaners", /label/i],
  ["headphone-cushions-and-tips", /model/i],
  ["system-and-power-cables", /mains/i],
  ["army-pants", /color/i],
  ["athletic-heather-t-shirts", /composition/i],
  ["basketball-sneakers", /court/i],
  ["beige-coats", /care/i],
  ["beige-white-shirts-tops", /care/i],
  ["black-motorcycle-jackets", /protect/i],
  ["black-performance-polo-shirts", /shrink/i],
  ["blue-more-responsible-materials-polo-shirts", /claim/i],
  ["blue-more-responsible-materials-shirts-and-tops", /claim/i],
  ["black-snow-pants", /shell/i],
  ["baby-car-seat-accessories", /manufacturer/i],
  ["beige-food-beverage-carriers", /temperature/i],
  ["bakeware", /temperature/i],
  ["beige-seat-cushions", /care/i],
  ["blue-white-kitchen-dining", /dishwasher/i],
  ["amber-decor", /name/i],
  ["bird-feeders", /squirrel/i],
  ["lens-cleaners", /coat/i],
  ["audio-cards-and-adapters", /signal/i],
  ["computer-interface-cards-and-adapters", /voltage/i],
];

test("reviewed guides replace unsafe source advice consistently in visible HTML, schema and hydration", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.guide-review-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const sourcePages = ReviewedTopics.map(([slug]) => ({
    ...fixture, slug, title: "Unreviewed buying guide", query: slug.replaceAll("-", " "),
    guide: ["Unsafe legacy blanket guidance."],
    faq: [{ question: "How should I choose?", answer: "Unsafe legacy blanket guidance." }],
    products: fixture.products.slice(0, 2),
  }));
  const pages = buildSearchPages(sourcePages, sourcePages.length).pages;
  const original = structuredClone(pages);
  await writePrebuiltPages({ searchPages: pages, categoryPages: [], popularSearches: { pages: [], moreSearches: [], categories: [] } }, folder);
  for (const [index, [slug, topic]] of ReviewedTopics.entries()) {
    const html = readFileSync(join(folder, `shop/s/${slug}.html`), "utf8");
    const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
    const body = readBody(html).replaceAll("&#x27;", "&#39;");
    assert.doesNotMatch(html, /Unsafe legacy blanket guidance/, slug);
    assert.match(published.guide.join(" "), topic, slug);
    assert.ok(body.includes(htmlEscape(published.title)), slug);
    for (const paragraph of published.guide) assert.ok(body.includes(htmlEscape(paragraph)), slug);
    const faq = readScriptJson(html, "page-schema").find(entry => entry["@type"] === "FAQPage");
    assert.deepEqual(faq.mainEntity.map(entry => ({ question: entry.name, answer: entry.acceptedAnswer.text })), published.faq, slug);
    for (const { question, answer } of published.faq) {
      assert.ok(body.includes(htmlEscape(question)), slug);
      assert.ok(body.includes(htmlEscape(answer)), slug);
    }
    assert.ok(html.includes(`<title>${htmlEscape(published.title)} | Shop Nobi</title>`), slug);
    assert.ok(html.includes(`content="${htmlEscape(published.description)}"`), slug);
    assert.deepEqual(published.products, original[index].products, slug);
    assert.equal(published.query, original[index].query, slug);
    assert.equal(published.updatedAt, original[index].updatedAt, slug);
  }
  assert.deepEqual(pages, original, "Source records are preserved for other publication surfaces");
});
