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
  ["100-cotton-clothing", /fiber/i, "The items include shirts, dresses, shorts, pants and polo styles, all made from 100 % cotton fabrics such as jersey, gauze and woven twill."],
  ["black-suede-footwear", /brand/i, "Most styles are loafers, pumps, heels and boots made from soft suede, often with a polished finish."],
  ["black-woven-swimwear", /capris/i, "The selection includes one-piece suits, bikini tops and bottoms, high-rise swim caps, board shorts and swim skirts, many with UPF50+ protection."],
  ["blue-navy-one-piece-swimsuits", /opacity/i, "Yes, as long as it has a secure fit and a lined interior to prevent transparency."],
  ["blue-swim-trunks", /rating/i, "Swim trunks protect the skin they cover, but you should still apply sunscreen to exposed areas."],
  ["blue-water-friendly-swimwear", /closure/i, "A peel-and-stick or elastic waist can improve fit, and bright blue prints help you stay visible in the water."],
  ["cotton-jeans", /distressed/i, "Stretch fibers add comfort, while raw or distressed finishes give a lived-in look."],
  ["cotton-outerwear", /shell/i, "Follow the label, usually machine wash on gentle and tumble dry low with clean tennis balls to restore loft."],
  ["blue-navy-cotton-shirts-tops", /blend/i, "Short-sleeve shirts provide more airflow, while lightweight long-sleeve options can protect from sun without overheating."],
  ["black-merino-wool-socks", /compression/i, "Mild compression can improve blood flow on long trips or during intense activity."],
  ["climbing-helmets", /sport/i, "Ventilation helps keep your head cool on warm days, but it may slightly reduce impact protection compared to a solid shell."],
  ["carabiners", /working load/i, "It indicates the maximum load the carabiner can hold; higher numbers mean stronger strength."],
  ["candle-snuffers", /cool/i, "When picking a snuffer, look for a length that lets you reach the flame without burning your fingers and a tip that fits the candle size, a small cup for tea lights and a broader edge for larger pillars. Metal snuffers stay cool and are easy to clean."],
  ["brown-ground-coffee", /grind/i, "Yes, a coarse grind works well for cold brew, though many cold brew recipes use whole beans that are ground after steeping."],
  ["brown-coffee-filters", /brewer/i, "The Toddy Reusable Cold Brew Coffee Filters (index 12) and the Fetish-style metal mesh filters are labeled reusable."],
  ["bulb-planting-tools", /depth/i, "A planter with a 2-inch depth guide works well for most tulip bulbs."],
  ["cabinet-knobs", /thread/i, "They fit standard mounting holes, so they can replace most standard knobs regardless of color."],
  ["clear-glass-tableware", /material/i, "All items are made from transparent, lead-free glass that is typically dishwasher-safe. Thicker glasses feel more durable, while thinner designs are elegant but may chip more easily."],
  ["ceramic-drinkware", /component/i, "Most stoneware with a glaze label is microwave-safe, but check the manufacturer’s instructions."],
  ["ceiling-light-fixtures", /dimm/i, "Yes, use dimmable LED bulbs and a compatible dimmer switch for smooth light control."],
];

test("reviewed guides replace unsafe source advice consistently in visible HTML, schema and hydration", async t => {
  const folder = mkdtempSync(new URL("../node_modules/.guide-review-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const sourcePages = ReviewedTopics.map(([slug, , stale = "Unsafe legacy blanket guidance."]) => ({
    ...fixture, slug, title: "Unreviewed buying guide", query: slug.replaceAll("-", " "),
    guide: [stale],
    faq: [{ question: "How should I choose?", answer: stale }],
    products: fixture.products.slice(0, 2),
  }));
  const pages = buildSearchPages(sourcePages, sourcePages.length).pages;
  const original = structuredClone(pages);
  await writePrebuiltPages({ searchPages: pages, categoryPages: [], popularSearches: { pages: [], moreSearches: [], categories: [] } }, folder);
  for (const [index, [slug, topic, stale = "Unsafe legacy blanket guidance."]] of ReviewedTopics.entries()) {
    const html = readFileSync(join(folder, `shop/s/${slug}.html`), "utf8");
    const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
    const body = readBody(html).replaceAll("&#x27;", "&#39;");
    assert.ok(!html.includes(htmlEscape(stale)), `${slug}: legacy claim removed`);
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
