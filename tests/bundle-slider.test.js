import assert from "node:assert/strict";
import { join } from "node:path";
import { before, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";
import { MESSAGE_BUNDLES } from "../src/constants/pricing.js";

const RendererEntry = fileURLToPath(new URL("./fixtures/render-bundle-slider.jsx", import.meta.url));
const RendererFolder = fileURLToPath(new URL("../node_modules/.cache/bundle-slider-test/", import.meta.url));
const PublishedBundles = [
  ["500", "$25", "$0.050"], ["1,000", "$45", "$0.045"], ["2,500", "$105", "$0.042"], ["5,000", "$199", "$0.040"],
  ["10,000", "$379", "$0.038"], ["15,000", "$539", "$0.036"], ["20,000", "$699", "$0.035"], ["30,000", "$999", "$0.033"],
  ["50,000", "$1,599", "$0.032"], ["75,000", "$2,325", "$0.031"], ["100,000", "$2,999", "$0.030"],
];

let renderBundleSlider;
let renderPricingPlans;

before(async () => {
  // The build has its own folder, since test files run at once and other builds empty theirs.
  await build({
    configFile: false,
    logLevel: "warn",
    build: {
      ssr: RendererEntry,
      outDir: RendererFolder,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "renderer.mjs" } },
    },
  });
  ({ renderBundleSlider, renderPricingPlans } = await import(pathToFileURL(join(RendererFolder, "renderer.mjs")).href));
});

/** Strips tags so the test reads the slider as a visitor sees it. */
function visibleText(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Reads the slider's message count and its price block, as a visitor sees them. */
function readSlider(html) {
  const label = visibleText(html.match(/<label[^>]*>([\s\S]*?)<\/label>/)[1]);
  const price = visibleText(html.match(/<div class="pp-base[^"]*">([\s\S]*?)<\/div>/)[1]);
  return { label, price };
}

test("the slider starts on the $25 bundle", () => {
  const html = renderBundleSlider();
  assert.ok(html.includes('aria-valuetext="500 messages for $25 a month"'));
  assert.ok(html.includes('type="range"') && html.includes('max="11"') && html.includes('value="0"'));
  assert.deepEqual(readSlider(html), { label: "500 messages a month", price: "$25 / month $0.050 per message" });
});

test("each bundle stop shows its messages, price, and price per message", () => {
  PublishedBundles.forEach(([messages, price, pricePerMessage], stop) => {
    const html = renderBundleSlider(stop);
    assert.ok(html.includes(`aria-valuetext="${messages} messages for ${price} a month"`), messages);
    assert.deepEqual(readSlider(html), { label: `${messages} messages a month`, price: `${price} / month ${pricePerMessage} per message` });
  });
  assert.equal(PublishedBundles.length, MESSAGE_BUNDLES.length);
});

test("the last stop shows custom pricing and a way to talk to sales", () => {
  const html = renderBundleSlider(MESSAGE_BUNDLES.length);
  assert.ok(html.includes('aria-valuetext="Over 100,000 messages, custom pricing"'));
  assert.deepEqual(readSlider(html), { label: "Over 100,000 messages a month", price: "Custom pricing Talk to sales" });
});

test("the full bundle table sits behind a closed See all bundles toggle", () => {
  const html = renderPricingPlans();
  const toggle = html.match(/<details class="pp-all-bundles">([\s\S]*?)<\/details>/);
  assert.ok(toggle, "The table must be inside a closed toggle");
  assert.ok(toggle[1].includes("<summary>See all bundles</summary>"));
  const rows = [...toggle[1].matchAll(/<tr><th scope="row">([^<]+)<\/th><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/g)].map(row => row.slice(1));
  assert.deepEqual(rows, PublishedBundles);
});
