import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Reads the <loc> entries of a generated sitemap file, in the order they appear. */
function sitemapLocations(file) {
  const xml = readFileSync(join(ROOT, "public", file), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
}

test("the knowledge base index lists the site's pages and the product docs, and no shop pages", () => {
  const xml = readFileSync(join(ROOT, "public/sitemap-kb.xml"), "utf8");
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex '));
  assert.deepEqual(sitemapLocations("sitemap-kb.xml"), [
    "https://nobi.ai/sitemap-pages.xml",
    "https://docs.nobi.ai/sitemap.xml",
  ]);
});

test("the crawler index still lists the pages and the shop, and never the docs subdomain", () => {
  assert.deepEqual(sitemapLocations("sitemap.xml"), [
    "https://nobi.ai/sitemap-pages.xml",
    "https://nobi.ai/sitemap-shop.xml",
  ]);
});

test("robots.txt points crawlers at the crawler index only, never at the knowledge base index", () => {
  const robots = readFileSync(join(ROOT, "public/robots.txt"), "utf8");
  assert.ok(robots.includes("Sitemap: https://nobi.ai/sitemap.xml"));
  assert.ok(!robots.includes("sitemap-kb.xml"));
});
