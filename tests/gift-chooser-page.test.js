import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { chooseGifts, readGiftChoice } from "../src/utils/giftChoice.js";
import { isShopNobiPath } from "../src/utils/shopNobiPage.js";

let server;
let page;

before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  page = await server.ssrLoadModule("/src/pages/GiftChooser.jsx");
});
after(async () => { await server?.close(); });

/** Use real form input, selection logic and the actual result component, without a browser or network search. */
function renderChoice(answers) {
  const form = new FormData();
  Object.entries(answers).forEach(([name, value]) => form.set(name, String(value)));
  const selection = chooseGifts(readGiftChoice(form));
  return renderToStaticMarkup(React.createElement(page.GiftResults, { selection }));
}

test("initial actual page has labeled native controls and no automatically selected result cards", () => {
  const html = renderToStaticMarkup(React.createElement(page.default));
  assert.ok(html.includes('name="interest"') && html.includes('name="budget"'));
  assert.ok(html.includes('type="submit"'));
  assert.ok(html.includes("Show my starting points"));
  assert.ok(!html.includes('class="gift-option"'));
  assert.ok(html.includes("does not run a live search"));
  assert.equal(isShopNobiPath("/tools/gift-chooser"), false);
});

test("real painting answers render three reasons, tradeoffs, exact retailer sources and the verified Nobi collection", () => {
  const html = renderChoice({ interest: "painting", budget: 50, shortHandlesOnly: "on" });
  assert.equal((html.match(/class="gift-option"/g) || []).length, 3);
  assert.equal((html.match(/Why it fits:/g) || []).length, 3);
  assert.equal((html.match(/What to check:/g) || []).length, 3);
  assert.ok(html.includes("SK-8113S"));
  assert.ok(html.includes("variant=49661782589726"));
  assert.ok(html.includes('class="gift-primary" href="https://nobi.ai/shop/s/silver-paint-brushes"'));
  assert.ok(html.includes("may earn a commission"));
  assert.ok(html.indexOf("may earn a commission") < html.indexOf('class="gift-primary" href="https://nobi.ai/shop/s/silver-paint-brushes"'), "Commission disclosure must precede the shopping continuation");
  assert.ok(html.includes('href="https://nobi.ai/shop"'));
  assert.ok(html.includes("Retailer source and details"));
  assert.ok(html.includes('rel="nofollow noopener"'));
  assert.ok(!html.includes("awin1.com"), "Plain saved objects must not invent network URLs");
});

test("real no-match state retains constraints in its request instead of showing unrelated products", () => {
  const html = renderChoice({ interest: "charging", budget: 50, avoidDeviceChecks: "on" });
  assert.ok(html.includes("No reviewed option meets those choices"));
  assert.ok(!html.includes('class="gift-option"'));
  assert.ok(html.includes("avoid gifts that need device-compatibility checks"));
  assert.ok(html.includes('href="https://nobi.ai/shop"'));
  assert.ok(!html.includes("?q="));
});

test("normal build publishes both utility URL forms with canonical metadata and discovery", () => {
  const flat = readFileSync(new URL("../dist/tools/gift-chooser.html", import.meta.url), "utf8");
  const directory = readFileSync(new URL("../dist/tools/gift-chooser/index.html", import.meta.url), "utf8");
  assert.equal(flat, directory);
  assert.ok(flat.includes('rel="canonical" href="https://nobi.ai/tools/gift-chooser"'));
  assert.ok(flat.includes("Start with what"));
  assert.ok(!flat.includes('class="gift-option"'));
  const styles = [...flat.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
    .map(([, href]) => readFileSync(new URL(`../dist${href}`, import.meta.url), "utf8")).join("\n");
  assert.ok(styles.includes(".gift-chooser"), "The initial authored HTML must be styled before route JavaScript loads");
  const sitemap = readFileSync(new URL("../dist/sitemap-pages.xml", import.meta.url), "utf8");
  assert.ok(sitemap.includes("https://nobi.ai/tools/gift-chooser"));
});
