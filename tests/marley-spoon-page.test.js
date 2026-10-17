import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { MarleySpoonOffer, MarleySpoonSeo } from "../src/content/marleySpoonCost.js";

const Dist = new URL("../dist/", import.meta.url);
const readPage = () => readFileSync(new URL("tools/marley-spoon-cost.html", Dist), "utf8");

test("the initial HTML makes the exact plan, every delivery and recurring subscription conditions readable without JavaScript", () => {
  const html = readPage();
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const fact of ["2 people. 3 meals. 6 servings.", "$80.94", "$12.99", "$93.93", "$61.55", "$65.60", "$85.84", "$81.79", "$298.83", "$380.62", "40% off food", "35% off food", "10% off food", "15% off food", "October 17, 2026", "Next full-price delivery", "recurring subscription", "eligible new customers", "skip, pause or cancel", "Excludes tax, extras", "Enable JavaScript", "not a review of the meals"]) assert.ok(html.includes(fact), `Missing ${fact}`);
  assert.ok(html.includes('id="delivery-count"'));
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(!html.includes('"@type":"Product"'), "No fake physical-product price schema");
  assert.ok(!html.includes("grocery savings"));
  assert.ok(!html.includes("per month"));
});

test("the disclosed subscription exit uses its exact reviewed plain destination in crawler HTML", () => {
  const html = readPage();
  assert.ok(html.includes(MarleySpoonOffer.url.replaceAll("&", "&amp;")));
  assert.ok(html.includes("Check offer at Marley Spoon"));
  assert.ok(html.includes("We may earn a commission from qualifying subscriptions through this link."));
  assert.equal((html.match(/rel="sponsored nofollow noopener"/g) || []).length, 1);
  assert.ok(!html.includes("https://www.awin1.com/"));
  assert.ok(!html.includes("productVariantId") && !html.includes("productPrice"));
  assert.ok(html.includes('href="https://marleyspoon.com/terms"'));
});

test("the utility has one canonical, complete URL forms, source metadata, site links and sitemap entry", () => {
  const html = readPage();
  assert.equal(html, readFileSync(new URL("tools/marley-spoon-cost/index.html", Dist), "utf8"));
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes('href="https://nobi.ai/tools/marley-spoon-cost"'));
  assert.ok(html.includes(`<title>${MarleySpoonSeo.title.replaceAll("&", "&amp;")}</title>`));
  assert.ok(html.includes('property="og:image" content="https://nobi.ai/media/marley-cost-01-intro-to-full.png"'));
  assert.ok(html.includes('name="twitter:image" content="https://nobi.ai/media/marley-cost-01-intro-to-full.png"'));
  for (const name of ["01-intro-to-full", "02-five-deliveries", "03-food-and-shipping"]) {
    const png = readFileSync(new URL(`media/marley-cost-${name}.png`, Dist));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1000);
    assert.equal(png.readUInt32BE(20), 1500);
  }
  for (const path of ["/shop", "/privacy", "/terms"]) assert.ok(html.includes(`href="${path}"`));
  assert.ok(readFileSync(new URL("sitemap-pages.xml", Dist), "utf8").includes("<loc>https://nobi.ai/tools/marley-spoon-cost</loc>"));
});
