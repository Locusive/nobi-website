import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_ACTIVITY, estimateUsage, formatPrice, priceUsage } from "../src/utils/pricingEstimate.js";

test("the base includes both allowances independently, including no usage", () => {
  for (const usage of [{ searches: 0, messages: 0 }, { searches: 2500, messages: 250 }]) {
    assert.equal(priceUsage(usage).totalCents, 2500);
  }
  assert.equal(priceUsage({ searches: 0, messages: 251 }).totalCents, 2510);
  assert.equal(priceUsage({ searches: 2501, messages: 0 }).totalCents, 2501);
});

test("one additional search and two additional messages add exactly 21 cents", () => {
  const price = priceUsage({ searches: 2501, messages: 252 });
  assert.equal(price.totalCents, 2521);
  assert.equal(price.searchCostCents, 1);
  assert.equal(price.messageCostCents, 20);
  assert.equal(formatPrice(price.totalCents), "$25.21");
  assert.equal(formatPrice(2500), "$25");
});

test("traffic estimates follow the selected use, with no charges for inactive features", () => {
  const input = { ...DEFAULT_ACTIVITY, basis: "traffic", visitors: 100000 };
  const both = estimateUsage({ ...input, mode: "both" });
  assert.deepEqual(both, { searches: 3500, messages: 500 });
  assert.equal(priceUsage(both).totalCents, 6000);
  assert.equal(priceUsage(estimateUsage({ ...input, mode: "search" })).totalCents, 3500);
  assert.equal(priceUsage(estimateUsage({ ...input, mode: "assistant" })).totalCents, 5000);
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
