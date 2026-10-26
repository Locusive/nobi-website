import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { writePrebuiltPages } from "../scripts/shop-nobi-page-files.js";
import { buildSearchPages } from "../scripts/shop-nobi-search-page-view.js";
import { buildPopularSearches } from "../scripts/shop-nobi-category-page-view.js";
import { htmlEscape } from "../scripts/prerender-blog.js";
import { readFixturePageData } from "./shop-nobi-pages-server.js";
import { readBody, readScriptJson } from "./shop-nobi-test-build.js";
import { withAuthoredSearchPageCopy } from "../scripts/shop-nobi-editorial-copy.js";

/** A synthetic mixed listing exercises all retained shopping fields without copying a live catalogue. */
function mixedSuitcasePage() {
  const fixture = readFixturePageData().pages[0];
  return {
    ...fixture, slug: "blue-suitcases", title: "Blue Suitcases", query: "blue suitcases",
    guide: ["Blue suitcases on this page range from about $70 to $495. The collection includes hard-shell carry-ons, expandable checked bags, and a few novelty suitcases with built-in record players.", "Keep the remaining guidance."],
    faq: [{ question: "What size suitcase should I choose?", answer: "Check the retailer's measurements." },
      { question: "Do built-in tech suitcases affect durability?", answer: "Tech features add weight and moving parts, so check reviews for long-term reliability." }],
    products: Array.from({ length: 16 }, (_, index) => ({ ...fixture.products[0],
      name: index === 4 || index === 14 ? `Suitcase Record Player ${index}` : `Travel Suitcase ${index}`,
      productVariantId: `fixture-product-${index}`, url: `https://example.com/products/suitcase-${index}` })),
  };
}

/** Synthetic variants retain the same shopping fields while exercising gemstone/metal ambiguity. */
function whiteGoldPage() {
  const fixture = readFixturePageData().pages[0];
  return {
    ...fixture, slug: "14k-white-gold-statement-rings", title: "White Gold Statement Rings",
    query: "14k white gold statement rings",
    guide: ["14k white gold statement rings on this page are priced from $285 up to $2,309. They showcase bold designs such as clusters, twisted bands, signet shapes and gemstone settings, all crafted in white gold.", "Retain this additional guidance."],
    faq: [{ question: "What size should I choose?", answer: "Check the exact retailer's measurements." }],
    products: Array.from({ length: 19 }, (_, index) => ({ ...fixture.products[0],
      name: index === 12 ? "14K Gold Cluster White Topaz Ring" : `Statement Ring ${index}`,
      productVariantId: `fixture-ring-${index}`, url: `https://example.com/products/ring-${index}` })),
  };
}

test("white-gold clarification agrees across HTML, FAQ schema and hydration without reclassifying any product", async (t) => {
  const folder = mkdtempSync(new URL("../node_modules/.editorial-test-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<!doctype html><html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const { pages } = buildSearchPages([whiteGoldPage(), readFixturePageData().pages[0]], 2);
  const plan = { searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) };
  const original = structuredClone(plan);
  await writePrebuiltPages(plan, folder);
  const html = readFileSync(join(folder, "shop/s/14k-white-gold-statement-rings.html"), "utf8");
  const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
  const body = readBody(html).replaceAll("&#x27;", "&#39;");
  assert.ok(!html.includes("all crafted in white gold"));
  assert.match(published.guide[0], /that name alone does not establish that the ring's metal is white gold/);
  assert.equal(published.faq.at(-1).question, "Does a white gemstone mean a ring is white gold?");
  for (const text of [published.guide[0], published.faq.at(-1).question, published.faq.at(-1).answer]) {
    assert.ok(body.includes(htmlEscape(text)), text);
  }
  const schema = readScriptJson(html, "page-schema").find((entry) => entry["@type"] === "FAQPage");
  assert.deepEqual(schema.mainEntity, published.faq.map(({ question, answer }) =>
    ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })));
  for (const [key, value] of Object.entries(original.searchPages[0])) {
    if (!["guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
  }
  assert.equal(published.products.length, 19);
  assert.deepEqual(published.guide.slice(1), original.searchPages[0].guide.slice(1));
  assert.deepEqual(published.faq.slice(0, -1), original.searchPages[0].faq);
  assert.deepEqual(plan, original);
  const other = readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8");
  assert.deepEqual(readScriptJson(other, "shop-nobi-prebuilt-content").data, original.searchPages[1]);
});

test("white-gold clarification preserves refreshed guidance and does not duplicate an existing FAQ", () => {
  const refreshed = whiteGoldPage();
  refreshed.guide[0] = "New verified metal guidance.";
  assert.deepEqual(withAuthoredSearchPageCopy(refreshed), refreshed);
  const page = whiteGoldPage();
  const question = { question: "Does a white gemstone mean a ring is white gold?", answer: "Existing reviewed answer." };
  page.faq.push(question);
  const corrected = withAuthoredSearchPageCopy(page);
  assert.equal(corrected.faq.length, page.faq.length);
  assert.deepEqual(corrected.faq.at(-1), question);
  assert.deepEqual(withAuthoredSearchPageCopy(corrected), corrected);
});

test("suitcase clarification agrees across HTML, FAQ schema and hydration while retaining every shopping field", async (t) => {
  const folder = mkdtempSync(new URL("../node_modules/.editorial-test-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<!doctype html><html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const { pages } = buildSearchPages([mixedSuitcasePage(), fixture], 2);
  const plan = { searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) };
  const original = structuredClone(plan);
  await writePrebuiltPages(plan, folder);
  const html = readFileSync(join(folder, "shop/s/blue-suitcases.html"), "utf8");
  const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
  const body = readBody(html).replaceAll("&#x27;", "&#39;");
  assert.ok(!html.includes("novelty suitcases"));
  assert.ok(!html.includes("Do built-in tech suitcases affect durability?"));
  assert.match(published.guide[0], /record players are audio products, not bags for packing/);
  assert.equal(published.faq[1].question, "Are suitcase-style record players travel luggage?");
  for (const text of [published.guide[0], published.faq[1].question, published.faq[1].answer]) {
    assert.ok(body.includes(htmlEscape(text)), text);
  }
  const faq = readScriptJson(html, "page-schema").find((entry) => entry["@type"] === "FAQPage");
  assert.deepEqual(faq.mainEntity, published.faq.map(({ question, answer }) =>
    ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })));
  for (const [key, value] of Object.entries(original.searchPages[0])) {
    if (!["guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
  }
  assert.equal(published.products.length, 16);
  assert.deepEqual(published.guide.slice(1), original.searchPages[0].guide.slice(1));
  assert.deepEqual(published.faq[0], original.searchPages[0].faq[0]);
  assert.deepEqual(plan, original);
  const other = readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8");
  assert.deepEqual(readScriptJson(other, "shop-nobi-prebuilt-content").data, original.searchPages[1]);
});

test("suitcase correction leaves refreshed guidance and other pages intact", () => {
  for (const change of [
    (page) => { page.guide[0] = "Freshly reviewed luggage guidance."; },
    (page) => { page.faq[1].answer = "Freshly reviewed answer."; },
    (page) => { page.slug = "black-suitcases"; },
  ]) {
    const page = mixedSuitcasePage();
    change(page);
    assert.deepEqual(withAuthoredSearchPageCopy(page), page);
  }
});

for (const scenario of [
  {"slug": "amethyst-earrings", "title": "Amethyst Earrings: Compare Stones, Styles & Sizes", "stale": "Yes, 14k gold offers a balance of durability and richness, suitable for daily wear."},
  {"slug": "emerald-jewelry", "title": "Emerald Jewelry: Compare Stones, Settings & Fit", "stale": "Real emeralds usually have natural inclusions called jardin; a reputable seller will provide certification."},
  {"slug": "sundresses", "title": "Sundresses: Compare Lengths, Straps & Fabrics", "stale": "Cotton and linen sundresses can be machine washed on gentle cycle and tumble dried on low."},
  {"slug": "silver-watches", "title": "Silver Watches: Compare Dials, Cases & Fit", "stale": "Most silver watches should be serviced every 3 to 5 years."},
  {"slug": "black-maxi-dresses", "title": "Black Maxi Dresses: Compare Lengths, Fits & Details", "stale": "Any black maxi dress is suitable for formal events."},
  {"slug": "black-stud-earrings", "title": "Black Stud Earrings: Compare Sizes, Materials & Backs", "stale": "Choose earrings labeled nickel-free or made from sterling silver, gold-filled, or surgical steel to avoid reactions."},
  {"slug": "cream-rugs", "title": "Cream Rugs: Compare Sizes, Patterns & Room Fit", "stale": "Spot clean with a mild detergent and have it professionally cleaned to preserve the sheen."},
  {"slug": "brown-mini-dresses", "title": "Brown Mini Dresses: Compare Lengths, Shades & Fits", "stale": "Spot clean with a soft brush and avoid soaking; store them on a hanger to keep the shape."},
  { slug: "sterling-silver-rings", title: "Sterling Silver Rings: Compare Styles, Fit & Finish",
    stale: "A secure clasp or shank ensures the ring stays in place." },
  { slug: "pencil-skirts", title: "Pencil Skirts: Compare Stores, Fabrics & Fit",
    stale: "Pencil skirts range from $72 to $1290. Wool and leather need dry cleaning." },
  {"slug": "red-blouses", "title": "Red Blouses: Compare Shades, Styles & Stores", "stale": "Hand wash or use a gentle cycle with cold water and line dry to preserve the sheen."},
  {"slug": "navy-cardigans", "title": "Navy Cardigans: Compare Knits, Lengths & Layers", "stale": "Cashmere provides the most warmth and softness, while cotton blends are lighter and easier to care for."},
  {"slug": "multicolor-sweaters", "title": "Multicolor Sweaters: Compare Patterns, Knits & Fit", "stale": "Fair Isle knits are usually made from wool or wool blends, providing good insulation for cooler weather."},
  {"slug": "gray-cargo-pants", "title": "Gray Cargo Pants: Compare Fits, Pockets & Lengths", "stale": "quick-dry and UPF fabrics are great for hiking"},
  {"slug": "green-wallets", "title": "Green Wallets: Compare Cardholders, Bifolds & Zip Styles", "stale": "RFID protection is useful for safeguarding your cards from electronic skimming."},
  {"slug": "pink-swim-trunks", "title": "Pink Swim Trunks: Compare Lengths, Liners & Prints", "stale": "Polyester and nylon blends dry fastest and resist chlorine damage."},
  {"slug": "blue-navy-blouses", "title": "Navy & Blue Blouses: Compare Shades, Fabrics & Fits", "stale": "choose a silk blend for more durability"},

]) test(`${scenario.slug} guidance agrees across HTML, metadata, schema and browser data while retaining shopping data`, async (t) => {
  const folder = mkdtempSync(new URL("../node_modules/.editorial-test-", import.meta.url));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  writeFileSync(join(folder, "index.html"), '<!doctype html><html><head><!--__PRERENDER_TITLE__--><!--__PRERENDER_DESC__--></head><body><div id="root"></div></body></html>');
  const fixture = readFixturePageData().pages[0];
  const authored = {
    ...fixture,
    slug: scenario.slug,
    title: "Old search-page title",
    description: "Old search-page description",
    guide: [scenario.stale],
    faq: [{ question: "Old question", answer: "Old answer" }],
  };
  const { pages } = buildSearchPages([authored, fixture], 2);
  const plan = { searchPages: pages, categoryPages: [], popularSearches: buildPopularSearches(pages, []) };
  const originalPlan = structuredClone(plan);

  await writePrebuiltPages(plan, folder);

  const html = readFileSync(join(folder, `shop/s/${scenario.slug}.html`), "utf8");
  const published = readScriptJson(html, "shop-nobi-prebuilt-content").data;
  // React and the head renderer use equivalent numeric apostrophe entities.
  const body = readBody(html).replaceAll("&#x27;", "&#39;");
  assert.equal(published.title, scenario.title);
  assert.ok(html.includes(`<title>${htmlEscape(published.title)} | Shop Nobi</title>`));
  assert.ok(html.includes(`<meta name="description" content="${htmlEscape(published.description)}">`));
  assert.ok(body.includes(`>${htmlEscape(published.title)}</h1>`));
  for (const paragraph of published.guide) assert.ok(body.includes(htmlEscape(paragraph)));
  assert.equal(published.guide.length, 4);
  assert.equal(published.faq.length, 4);
  for (const { question, answer } of published.faq) {
    assert.ok(body.includes(htmlEscape(question)));
    assert.ok(body.includes(htmlEscape(answer)));
  }
  if (!["sterling-silver-rings", "pencil-skirts"].includes(scenario.slug)) {
    assert.match(published.guide.join(" "), /Shop Nobi search/);
    assert.ok(!published.title.includes("Best "));
  }
  const schema = readScriptJson(html, "page-schema");
  assert.deepEqual(schema.find((entry) => entry["@type"] === "FAQPage").mainEntity,
    published.faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })));
  assert.ok(!html.includes(htmlEscape(scenario.stale)));
  assert.ok(!html.includes("Old answer"));
  if (scenario.slug === "pencil-skirts") {
    assert.ok(!html.includes("$72"));
    assert.ok(!html.includes("need dry cleaning"));
    assert.match(published.guide.join(" "), /Shop Nobi search box below/);
    assert.match(published.guide.join(" "), /exact fabric composition, lining and care label/);
  }
  for (const [key, value] of Object.entries(originalPlan.searchPages[0])) {
    if (!["title", "description", "guide", "faq"].includes(key)) assert.deepEqual(published[key], value, key);
  }
  assert.deepEqual(plan, originalPlan, "Feed and Web Story consumers retain the original plan");

  const otherHtml = readFileSync(join(folder, "shop/s/black-leather-boots.html"), "utf8");
  assert.deepEqual(readScriptJson(otherHtml, "shop-nobi-prebuilt-content").data, originalPlan.searchPages[1]);
  assert.ok(otherHtml.includes("<title>Black Leather Boots | Shop Nobi</title>"));
  assert.ok(!otherHtml.includes(htmlEscape(scenario.title)));
});
