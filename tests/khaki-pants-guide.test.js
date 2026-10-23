import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const Slug = "khaki-pants-fit-guide";
const Canonical = `https://nobi.ai/blog/${Slug}`;
const CollectionPath = "/shop/s/womens-khaki-pants";
const BaleafStatement = "Locusive, Inc. (Shop Nobi) is a participant in the baleaf Affiliate Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to the partner site.";
const article = () => readFileSync(`dist/blog/${Slug}/index.html`, "utf8");

/** Preserves the contract notice beside the actual dated listing comparison, without adding merchant links. */
test("khaki comparison keeps the complete participation statement before six qualified listing examples", () => {
  const html = article();
  const text = html.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, "&");
  assert.equal(text.split(BaleafStatement).length - 1, 1);
  assert.ok(text.indexOf(BaleafStatement) < text.indexOf("<table>"));
  const comparison = text.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];
  assert.equal((comparison.match(/<tr>/g) || []).length, 6);
  for (const name of ["Women's Tall Quick-Dry Hiking Cargo Pants", '25" Ankle Length Pull On Travel Pants (Petite)', 'Women\'s 19" Quick-Dry Yoga Capri Pants', 'Baleaf Ultra-Soft High-Rise Wide Leg Pants 25"', "Sculpt High-Waist Tapered Yoga Pants", "High-Waist Fleece-Lined Drawstring Flare Pants"]) {
    assert.ok(comparison.includes(name), name);
  }
  assert.ok(text.includes("October 18, 2026"));
  assert.ok(text.includes("not our measured performance claims"));
  assert.ok(text.includes("does not establish the selected colour at checkout"));
  assert.ok(text.includes("may earn a commission"));
  assert.equal((text.match(/href="https:\/\/(?:www\.)?baleaf\.com/g) || []).length, 0);
});

/** The original comparison is discoverable and continues through the existing collection without a new affiliate URL. */
test("khaki guide has its own canonical, sitemap and listing entry with two collection continuations", () => {
  const html = article();
  assert.ok(html.includes(`rel="canonical" href="${Canonical}"`));
  assert.equal(html.split(`href="${CollectionPath}"`).length - 1, 2);
  assert.ok(readFileSync("public/sitemap-pages.xml", "utf8").includes(`<loc>${Canonical}</loc>`));
  assert.ok(readFileSync("dist/blog.html", "utf8").includes(`/blog/${Slug}`));
  assert.ok(!html.includes("Publisher handoff, remove before publication"));
});
