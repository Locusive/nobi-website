import assert from "node:assert/strict";
import { createServer } from "vite";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const server = await createServer({ server: { host: "127.0.0.1", port: 0 } });
await server.listen(); const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
try {
 browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
 const observations = [];
 for (const width of [1280, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width === 390, isMobile: width === 390 });
  try {
   const page = await context.newPage();
   await page.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
   await page.goto(`${origin}/gift-guides`);
   await page.getByRole("link", { name: "calculate your gift budget after estimated fees" }).click();
   await page.getByLabel("Total estimated shipping (USD)").fill("10");
   await page.getByLabel("Total estimated tax (USD)").fill("8");
   await page.getByLabel("Total estimated wrapping (USD)").fill("2");
   await page.getByLabel("Number of gifts (optional)").fill("3");
   const button = page.getByRole("button", { name: "Calculate gift budget" });
   if (width === 1280) { await button.focus(); await page.keyboard.press("Enter"); } else await button.tap();
   const result = page.getByRole("region", { name: "Budget result" });
   await result.getByRole("heading", { name: "$80.00 left for gifts" }).waitFor();
   assert.match(await result.innerText(), /\$26\.66/); assert.match(await result.innerText(), /\$0\.02/);
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   await page.evaluate(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
   assert.equal(await page.evaluate(() => window.scrollY), 0);
   await page.screenshot({ path: `agents/gift_budget/budget-${width}.png`, fullPage: true });
   await page.getByLabel("Total budget (USD)").fill("1e3"); await button.click();
   await page.getByRole("alert").waitFor(); assert.equal(await page.getByLabel("Total budget (USD)").getAttribute("aria-invalid"), "true");
   assert.ok(!(await result.innerText()).includes("$26.66"));
   await page.getByLabel("Total budget (USD)").fill("5"); await button.click();
   await result.getByRole("heading", { name: "Your fee estimates exceed the budget" }).waitFor();
   assert.match(await result.innerText(), /\$15\.00 shortfall/);
   observations.push({ width, keyboardOrTouch: true, feeTotalsAndCentSplit: true, staleResultCleared: true, validation: true, shortfall: true, noOverflow: true });
  } finally { await context.close(); }
 }
 assert.equal(browser.contexts().length, 0); console.log(JSON.stringify({ passed: true, observations, remainingContexts: 0, remoteRequestsAborted: true }));
} finally { if (browser) await browser.close(); await server.close(); }
