// Explicit isolated browser regression: PLAYWRIGHT_MODULE may point to an existing local installation.
import { createServer } from "vite";
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const server = await createServer({ server: { host: "127.0.0.1", port: 4794, strictPort: true } });
await server.listen();
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
try {
 const context = await browser.newContext(); const page = await context.newPage();
 const data = { slug: "audio-components", title: "Audio components", query: "audio components", description: "Compare audio components", breadcrumbs: [], guide: [], products: [{ name: "Existing amplifier", url: "https://example.org/amplifier", price: 100, currency: "USD" }], faq: [], related: [] };
 await page.route("**/*", async route => {
  const url = new URL(route.request().url());
  if (url.origin !== "http://127.0.0.1:4794") return route.abort();
  if (route.request().isNavigationRequest()) {
   const response = await route.fetch(); const html = await response.text();
   return route.fulfill({ response, body: html.replace("</head>", `<script type="application/json" id="shop-nobi-prebuilt-content">${JSON.stringify({ kind: "search-page", path: "/shop/s/audio-components", data })}</script></head>`) });
  }
  return route.continue();
 });
 await page.goto("http://127.0.0.1:4794/shop/s/audio-components");
 await page.getByRole("link", { name: "Existing amplifier" }).waitFor();
 await page.getByRole("link", { name: "headphone gift guide: four checks before you buy" }).waitFor();
 await page.evaluate(() => window.dispatchEvent(new CustomEvent("nobi-displayed-product-collection")));
 await page.getByRole("link", { name: "Existing amplifier" }).waitFor({ state: "detached" });
 assert.equal(await page.getByRole("link", { name: "headphone gift guide: four checks before you buy" }).count(), 1);
 await context.close(); assert.equal(browser.contexts().length, 0);
 console.log(JSON.stringify({ passed: true, prebuiltCardRemovedByRealEvent: true, guideRemains: true, isolatedContextsRemaining: 0, remoteRequestsAborted: true }));
} finally { await browser.close(); await server.close(); }
