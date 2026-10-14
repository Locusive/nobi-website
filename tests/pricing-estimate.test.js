import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { MESSAGE_BUNDLES } from "../src/constants/pricing.js";
import { DEFAULT_ACTIVITY, estimateUsage, formatPrice, formatPricePerMessage, priceUsage } from "../src/utils/pricingEstimate.js";

test("the estimate picks the smallest bundle that fits, and adds 3 cents a message above 100,000", () => {
  for (const [messages, bundleMessages, totalCents, talkToSales] of [
    [0, 500, 2500, false],
    [500, 500, 2500, false],
    [501, 1000, 4500, false],
    [100000, 100000, 299900, false],
    [100001, 100000, 299903, true],
  ]) {
    const price = priceUsage({ searches: messages, messages: 0 });
    assert.equal(price.bundle.messages, bundleMessages, `${messages} messages`);
    assert.equal(price.totalCents, totalCents, `${messages} messages`);
    assert.equal(price.talkToSales, talkToSales, `${messages} messages`);
  }
});

test("every bundle holds exactly its own count, and one more message moves to the next bundle", () => {
  MESSAGE_BUNDLES.slice(0, -1).forEach((bundle, index) => {
    assert.equal(priceUsage({ searches: bundle.messages, messages: 0 }).bundle, bundle);
    assert.equal(priceUsage({ searches: bundle.messages + 1, messages: 0 }).bundle, MESSAGE_BUNDLES[index + 1]);
  });
});

test("searches and chat questions add up to one message count", () => {
  const price = priceUsage({ searches: 300, messages: 201 });
  assert.equal(price.totalMessages, 501);
  assert.equal(formatPrice(price.totalCents), "$45");
});

test("the price per message matches the published list", () => {
  const published = ["$0.050", "$0.045", "$0.042", "$0.040", "$0.038", "$0.036", "$0.035", "$0.033", "$0.032", "$0.031", "$0.030"];
  assert.deepEqual(MESSAGE_BUNDLES.map(formatPricePerMessage), published);
  assert.equal(formatPrice(2521), "$25.21");
});

test("llms.txt lists the same bundles as the code", () => {
  const llmsText = readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8");
  for (const bundle of MESSAGE_BUNDLES) {
    const row = `| ${bundle.messages.toLocaleString("en-US")} | ${formatPrice(bundle.priceCents)} | ${formatPricePerMessage(bundle)} |`;
    assert.ok(llmsText.includes(row), `Missing llms.txt row: ${row}`);
  }
});

test("traffic estimates follow the selected use and price the combined messages", () => {
  const input = { ...DEFAULT_ACTIVITY, basis: "traffic", visitors: 100000 };
  const both = estimateUsage({ ...input, mode: "both" });
  assert.deepEqual(both, { searches: 3500, messages: 500 });
  assert.equal(priceUsage(both).totalCents, 19900);
  assert.equal(priceUsage(estimateUsage({ ...input, mode: "search" })).totalCents, 19900);
  assert.equal(priceUsage(estimateUsage({ ...input, mode: "assistant" })).totalCents, 2500);
});

test("direct counts preserve zero and ignore unused inputs when switching use", () => {
  assert.deepEqual(estimateUsage({ mode: "search", basis: "usage", searches: "0", messages: "" }), { searches: 0, messages: 0 });
  assert.deepEqual(estimateUsage({ mode: "assistant", basis: "usage", searches: 999999, messages: 500 }), { searches: 0, messages: 500 });
  assert.deepEqual(estimateUsage({ ...DEFAULT_ACTIVITY, mode: "both", basis: "traffic", visitors: 0 }), { searches: 0, messages: 0 });
});

test("invalid input cannot produce a misleading monthly price", () => {
  for (const searches of ["", " ", -1, 0.5, Infinity, NaN, "abc", 100000001]) {
    assert.equal(estimateUsage({ mode: "both", basis: "usage", searches, messages: 0 }), null);
  }
  assert.equal(estimateUsage({ ...DEFAULT_ACTIVITY, mode: "both", basis: "traffic", visitors: "" }), null);
  assert.equal(estimateUsage({ ...DEFAULT_ACTIVITY, mode: "both", basis: "traffic", messagesPerHundred: -1 }), null);
  assert.equal(estimateUsage({ ...DEFAULT_ACTIVITY, mode: "other", basis: "traffic" }), null);
  assert.throws(() => priceUsage({ searches: -1, messages: 0 }), RangeError);
});
