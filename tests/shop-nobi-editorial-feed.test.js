import test from "node:test";
import assert from "node:assert/strict";
import { buildEditorialFeed, flipboardGuideUrl } from "../scripts/shop-nobi-editorial-feed.js";

test("publisher feed contains twenty recent live guides with stable IDs and tagged links", () => {
  const guides = Array.from({ length: 21 }, (_, index) => ({
    slug: `guide-${index}`, path: `/gift-guides/guide-${index}`, editorial: true,
    products: Array(10).fill({}), authoredAt: `2026-11-05T${String(index).padStart(2, "0")}:00:00Z`,
    title: `Guide ${index} & more`, intro: "A real comparison of products and their different uses. ".repeat(7),
    methodology: "We checked current catalog listings and seller details.",
  }));
  const stories = guides.map((guide) => ({ guide, plan: { posterUrl: `https://nobi.ai/images/guide-${guide.slug}.jpg` } }));
  const feed = buildEditorialFeed(guides, stories);
  assert.equal((feed.match(/<item>/g) || []).length, 20);
  assert.match(feed, /Guide 20 &amp; more/);
  assert.doesNotMatch(feed, /Guide 0 &amp; more/);
  assert.match(feed, /utm_source=flipboard&amp;utm_medium=referral&amp;utm_campaign=editorial_pilot/);
  assert.match(feed, /<dc:creator>Shop Nobi Editorial Team<\/dc:creator>/);
  assert.match(feed, /<guid isPermaLink="false">https:\/\/nobi.ai\/gift-guides\/guide-20<\/guid>/);
});

test("publisher feed is withheld when fewer than twenty live pictured guides qualify", () => {
  assert.equal(buildEditorialFeed([], []), null);
  assert.equal(flipboardGuideUrl("/gift-guides/example"),
    "https://nobi.ai/gift-guides/example?utm_source=flipboard&utm_medium=referral&utm_campaign=editorial_pilot");
});
