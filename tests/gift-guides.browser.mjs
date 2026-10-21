import assert from "node:assert/strict";
import { createServer } from "vite";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const server = await createServer({ server: { host: "127.0.0.1", port: 0, strictPort: true } });
await server.listen(); const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
try {
 browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
 const observations = [];
 for (const width of [1280, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width === 390, hasTouch: width === 390 });
  try {
   const page = await context.newPage();
   await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
   await page.goto(`${origin}/shop`);
   await page.getByRole("link", { name: "Looking for a gift? Explore our gift guides" }).click();
   await page.getByRole("heading", { level: 1 }).waitFor();
   assert.equal(new URL(page.url()).pathname, "/gift-guides");
   assert.equal(await page.title(), "Gift Guides: Choose by the Person | Shop Nobi");
   assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://nobi.ai/gift-guides");
   assert.equal(await page.locator('section[aria-label="Choose a gift guide"] article').count(), 3);
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   await page.screenshot({ path: `agents/gift_guides/hub-${width}.png`, fullPage: true });
   const link = page.getByRole("link", { name: width === 1280 ? "Headphones as a Gift: Four Checks Before You Buy" : "How to Choose a Trivia Card Game as a Gift", exact: true });
   if (width === 1280) { await link.focus(); await page.keyboard.press("Enter"); } else await link.tap();
   await page.waitForURL(`**/blog/${width === 1280 ? "headphones-as-a-gift" : "trivia-card-game-gift"}`);
   await page.getByRole("heading", { level: 1 }).waitFor();
   observations.push({ width, hubEntry: true, threeChoices: true, noOverflow: true, articleReached: new URL(page.url()).pathname, input: width === 1280 ? "keyboard" : "touch" });
  } finally { await context.close(); }
 }
 assert.equal(browser.contexts().length, 0);
 console.log(JSON.stringify({ passed: true, observations, remoteRequestsAborted: true, remainingContexts: 0 }));
} finally { if (browser) await browser.close(); await server.close(); }
