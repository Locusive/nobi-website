import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPinFeed } from "../scripts/shop-nobi-pin-feed.js";

/** Builds a search page with one product per picture address. */
function makePage(slug, refreshedAt, imageUrls) {
  const products = imageUrls.map((imageUrl) => ({ name: "Boot", url: "https://store.example/boot", imageUrl }));
  return { slug, title: slug, description: null, refreshedAt, breadcrumbs: [], faq: [], products };
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
  const feed = buildPinFeed(pages);
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
  const feed = buildPinFeed(pages, 2);
  assert.deepEqual(readItemLinks(feed), ["http-then-https", "second"]);
  assert.ok(feed.includes('<media:content url="https://cdn.example/secure.jpg" medium="image"/>'));
});
