import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { GiftGuides, GiftGuidesSeo } from "../src/content/giftGuides.js";

test("three guide choices identify actual published articles with matching titles", () => {
 assert.equal(GiftGuides.length, 3); assert.equal(new Set(GiftGuides.map(guide => guide.slug)).size, 3);
 const posts = readdirSync("src/content/posts").map(name => readFileSync(`src/content/posts/${name}`, "utf8"));
 for (const guide of GiftGuides) {
  const post = posts.find(text => text.includes(`slug: "${guide.slug}"`));
  assert.ok(post); assert.ok(post.includes(`title: "${guide.title}"`)); assert.match(post, /draft: false/);
 }
});
test("both built URL forms contain the actual guide links, title and canonical without JavaScript", () => {
 for (const file of ["dist/gift-guides.html", "dist/gift-guides/index.html"]) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes(`<title>${GiftGuidesSeo.title}</title>`));
  assert.ok(html.includes('rel="canonical" href="https://nobi.ai/gift-guides"'));
  for (const guide of GiftGuides) assert.ok(html.includes(`href="/blog/${guide.slug}"`));
  assert.ok(html.includes('href="/tools/gift-chooser"'));
  assert.ok(html.includes("we may earn a commission"));
  assert.ok(!html.includes('schema.org/InStock'));
 }
 const sitemap = readFileSync("public/sitemap-pages.xml", "utf8");
 assert.equal((sitemap.match(/<loc>https:\/\/nobi.ai\/gift-guides<\/loc>/g) || []).length, 1);
});
test("collection schema names only these existing guides without offers or product ratings", () => {
 const schema = GiftGuidesSeo.schema[0]; assert.equal(schema["@type"], "CollectionPage");
 assert.deepEqual(schema.hasPart.map(item => item.url), GiftGuides.map(guide => `https://nobi.ai/blog/${guide.slug}`));
 assert.ok(!JSON.stringify(schema).includes('"offers"')); assert.ok(!JSON.stringify(schema).includes('"aggregateRating"'));
});