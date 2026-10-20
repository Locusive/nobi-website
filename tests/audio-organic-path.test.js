import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
let server, Content;
before(async () => { server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" }); Content = (await server.ssrLoadModule("/src/components/shopNobi/ShopNobiSearchPageContent.jsx")).default; });
after(async () => { await server?.close(); });
const Page = { slug: "audio-components", title: "Audio components", query: "audio components", breadcrumbs: [], guide: [], products: [{ name: "Existing amplifier", url: "https://example.org/amplifier", imageUrl: "https://example.org/image.jpg", price: 100, currency: "USD", paidLink: true }], faq: [], related: [] };
const render = page => renderToStaticMarkup(React.createElement(Content, { page }));
test("audio landing provides one crawlable, conditional guide path while retaining the original card", () => {
 const html = render(Page);
 assert.equal((html.match(/href="\/blog\/headphones-as-a-gift"/g) || []).length, 1);
 assert.match(html, /Buying headphones as a gift/); assert.match(html, /For speakers, amplifiers/);
 for (const value of ["https://example.org/amplifier", "https://example.org/image.jpg", "Existing amplifier", "$100.00", "We may earn a commission", "sponsored nofollow noopener"]) assert.ok(html.includes(value), value);
 assert.ok(html.indexOf("Existing amplifier") < html.indexOf("Buying headphones as a gift"));
});
test("unrelated pages retain their content without the audio guide or an invented search submission", () => {
 const html = render({ ...Page, slug: "coffee-grinders" });
 assert.ok(!html.includes("headphones-as-a-gift")); assert.ok(!html.includes("?q=")); assert.match(html, /Existing amplifier/);
});
