import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { buildElectionNightMealUrl, ElectionNightEntryPoint, ElectionNightPath, ElectionNightProduct, ElectionNightQuery, ElectionNightSeo, ElectionNightSlug } from "../src/content/electionNight.js";
import { ElectionNightLinkArtifact } from "../src/content/electionNightLink.js";
import { handleProductLinkClick } from "../src/utils/shopNobiProductClick.js";
import { makeBrowser } from "./fixtures/shop-nobi-click-browser.js";

const Dist = new URL("../dist/", import.meta.url);
const readPage = () => readFileSync(new URL("election-night-survival-kit.html", Dist), "utf8");

test("the static checklist is useful without JavaScript and discloses before the first earning link", () => {
  const html = readPage();
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const text of ["Election Night", "Survival Kit", "November 3, 2026", "Start with what you already own", "Charge your phone", "Check your cable", "Plan dinner", "Put water", "Choose a screen-break", "no promise that a new order will arrive", "preparation and cooking", "recurring subscription", "not a hands-on test", "does not provide election results or voting instructions", "Affiliate attribution may not be available without JavaScript"]) {
    assert.ok(html.includes(text), `Missing useful fact or limit: ${text}`);
  }
  const disclosure = html.indexOf("#ad");
  const earningLink = html.indexOf(`href="${ElectionNightProduct.url.replaceAll("&", "&amp;")}"`);
  assert.ok(disclosure >= 0 && disclosure < earningLink);
  assert.ok(html.includes('rel="sponsored nofollow noopener"'));
  assert.ok(!html.includes("https://www.awin1.com/"));
  assert.ok(!html.includes("$29.99") && !html.includes("$93.93") && !html.includes("Petcube"));
  assert.ok(!html.includes('"@type":"Product"'), "No invented review or live-stock schema");
});

test("the page has both static URL forms, metadata, original media and sitemap discovery", () => {
  const html = readPage();
  assert.equal(html, readFileSync(new URL("election-night-survival-kit/index.html", Dist), "utf8"));
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`href="https://nobi.ai${ElectionNightPath}"`));
  assert.ok(html.includes(`<title>${ElectionNightSeo.title}</title>`));
  assert.ok(html.includes('property="og:image" content="https://nobi.ai/media/election-night-preview.png"'));
  for (const file of ["election-night-preview.svg", "election-night-preview.png", "election-night-video-poster.png", "election-night-15s.mp4", "election-night-pin-01-checklist.png", "election-night-pin-02-power.png", "election-night-pin-03-dinner.png"]) {
    assert.ok(existsSync(new URL(`media/${file}`, Dist)), `Missing original media: ${file}`);
  }
  const png = readFileSync(new URL("media/election-night-preview.png", Dist));
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630]);
  assert.ok(html.includes('preload="none"'), "The optional video must not download eagerly");
  assert.ok(readFileSync(new URL("sitemap-pages.xml", Dist), "utf8").includes(`<loc>https://nobi.ai${ElectionNightPath}</loc>`));
});

test("the exact Java-built product exit keeps its real identity and campaign, with a fresh visit reference", () => {
  const pageUrl = `https://nobi.ai${ElectionNightPath}?utm_source=pinterest&utm_medium=organic&utm_campaign=election_night_2026&utm_content=usb_c_power_check`;
  const browser = makeBrowser({ pageUrl });
  const link = { href: ElectionNightProduct.url };
  handleProductLinkClick({ button: 0, currentTarget: link }, { product: ElectionNightProduct, position: 1, query: ElectionNightQuery, slug: ElectionNightSlug, entryPoint: ElectionNightEntryPoint }, browser);
  assert.equal(browser.beacons.length, 1);
  const event = browser.beacons[0].event;
  assert.equal(event.details.productVariantId, "816ffee6-f8a5-4a79-a1d0-d5e12f7529c1");
  assert.equal(event.details.pageUrl, pageUrl);
  assert.equal(event.details.utm_campaign, "election_night_2026");
  assert.equal(event.details.utm_content, "usb_c_power_check");
  assert.equal(event.details.entryPoint, "Shop Nobi Utility");
  assert.equal(event.details.query, "Election Night checklist");
  assert.equal(event.details.conversationId, undefined);
  const paid = new URL(link.href);
  assert.equal(paid.searchParams.get("awinmid"), "38962");
  assert.equal(paid.searchParams.get("awinaffid"), "3122300");
  assert.equal(paid.searchParams.get("ued"), ElectionNightProduct.url);
  assert.match(paid.searchParams.get("clickref"), /^election-night-survival-kit\.[a-z0-9]{8}$/);
  assert.equal(ElectionNightLinkArtifact.networkAttemptsByExercisedCode, 0);
  assert.equal(ElectionNightProduct.productId, "ac7c1f9c-4b6d-4b98-b423-aa47787df85c");
});

test("the calculator link carries only incoming acquisition tags and keeps a plain fallback", () => {
  assert.equal(buildElectionNightMealUrl(), "/tools/marley-spoon-cost");
  const address = new URL(buildElectionNightMealUrl("?utm_source=pinterest&utm_campaign=election_night_2026&utm_content=meal_kit_cost_check&email=private&contact-us=true&redirect=https://example.com"), "https://nobi.ai");
  assert.equal(address.pathname, "/tools/marley-spoon-cost");
  assert.deepEqual([...address.searchParams], [["utm_source", "pinterest"], ["utm_campaign", "election_night_2026"], ["utm_content", "meal_kit_cost_check"]]);
  assert.ok(readPage().includes('href="/tools/marley-spoon-cost"'));
});
