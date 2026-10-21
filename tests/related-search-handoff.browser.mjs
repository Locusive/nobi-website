// Isolated local navigation check. Remote SDK/analytics requests are aborted; this does not certify live results.
import assert from "node:assert/strict";
import { createServer } from "vite";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const server = await createServer({ server: { host: "127.0.0.1", port: 0, strictPort: true } });
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;

try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
  const cases = [
    { name: "desktop", viewport: { width: 1280, height: 900 }, title: "Weekend boots", query: 'boots & bags / "weekend" + <travel>', keyboard: true },
    { name: "mobile", viewport: { width: 390, height: 844 }, title: "Camera bags", legacy: true },
  ];
  const observations = [];
  for (const check of cases) {
    const context = await browser.newContext({ viewport: check.viewport, isMobile: check.name === "mobile", hasTouch: check.name === "mobile" });
    try {
      const page = await context.newPage();
      const data = {
        slug: "local-navigation-check", title: "Local navigation check", query: "local navigation check", description: "Isolated test data",
        breadcrumbs: [], guide: [], products: [], faq: [],
        related: [
          { slug: "boots", title: "Built boots page", query: "boots" },
          { slug: null, title: check.title, ...(check.legacy ? {} : { query: check.query }) },
        ],
      };
      const payload = JSON.stringify({ kind: "search-page", path: "/shop/s/local-navigation-check", data }).replaceAll("<", "\\u003c");
      await page.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== origin) return route.abort();
        if (route.request().isNavigationRequest() && url.pathname === "/shop/s/local-navigation-check") {
          const response = await route.fetch();
          const html = await response.text();
          return route.fulfill({ response, body: html.replace("</head>", `<script type="application/json" id="shop-nobi-prebuilt-content">${payload}</script></head>`) });
        }
        return route.continue();
      });
      await page.goto(`${origin}/shop/s/local-navigation-check`);
      assert.equal(await page.getByRole("link", { name: "Built boots page", exact: true }).getAttribute("href"), "/shop/s/boots");
      const relatedLink = page.getByRole("link", { name: check.title, exact: true });
      await relatedLink.waitFor();
      await relatedLink.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `agents/related_search/${check.name}-related-search.png` });
      if (check.keyboard) {
        await relatedLink.focus();
        await page.keyboard.press("Enter");
      } else {
        await relatedLink.tap();
      }
      await page.waitForURL((url) => url.pathname === "/shop" && url.searchParams.has("q"));
      const destination = new URL(page.url());
      assert.equal(destination.origin, origin);
      assert.equal(destination.searchParams.get("q"), check.legacy ? check.title : check.query);
      await page.getByText("Loading Shop Nobi…", { exact: true }).waitFor();
      observations.push({ viewport: check.name, input: check.keyboard ? "keyboard Enter" : "touch", originalQueryPreserved: !check.legacy, legacyTitleFallback: !!check.legacy, destinationPath: destination.pathname, routerMounted: true });
    } finally {
      await context.close();
    }
  }
  assert.equal(browser.contexts().length, 0);
  console.log(JSON.stringify({ passed: true, observations, remoteRequestsAborted: true, liveSearchResultsVerified: false, isolatedContextsRemaining: 0 }));
} finally {
  if (browser) await browser.close();
  await server.close();
}
