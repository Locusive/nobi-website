import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateDeliveryCost, formatDeliveryMoney } from "../src/utils/deliveryCost.js";
import { MarleySpoonPlan, MarleySpoonOffer, validateMarleySpoonLink } from "../src/content/marleySpoonCost.js";
import { MarleySpoonLinkArtifact } from "../src/content/marleySpoonLink.js";

test("the verified plan rounds each food discount before adding shipping", () => {
  const before = JSON.stringify(MarleySpoonPlan);
  const result = calculateDeliveryCost(MarleySpoonPlan, 5);
  assert.deepEqual(result.deliveries.map(row => row.foodCents), [4856, 5261, 7285, 7285, 6880, 8094]);
  assert.deepEqual(result.deliveries.map(row => row.totalCents), [6155, 6560, 8584, 8584, 8179, 9393]);
  assert.deepEqual(result.deliveries.map(row => row.discount), [40, 35, 10, 10, 15, 0]);
  assert.ok(result.deliveries.every(row => row.shippingCents === 1299));
  assert.equal(result.foodCents, 31567);
  assert.equal(result.shippingCents, 6495);
  assert.equal(result.totalCents, 38062);
  assert.equal(result.fullDeliveryCents, 9393);
  assert.equal(JSON.stringify(MarleySpoonPlan), before, "A local calculation never changes the dated source inputs");
});

test("delivered-box selection totals the first four, five and next full-price delivery without a monthly assumption", () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(count => calculateDeliveryCost(MarleySpoonPlan, count).totalCents), [6155, 12715, 21299, 29883, 38062, 47455]);
  assert.equal(formatDeliveryMoney(29883), "$298.83");
  assert.equal(formatDeliveryMoney(38062), "$380.62");
  assert.equal(formatDeliveryMoney(9393), "$93.93");
});

test("a half-cent food result rounds once and shipping receives no food discount", () => {
  const result = calculateDeliveryCost({ foodCents: 1, shippingCents: 2, foodDiscountPercentages: [50] }, 2);
  assert.deepEqual(result.deliveries.map(row => row.totalCents), [3, 3]);
  assert.equal(result.totalCents, 6);
});

test("invalid delivery counts or non-cent source inputs fail instead of displaying a misleading total", () => {
  for (const count of [0, -1, 7, 1.5, NaN, "5", undefined]) assert.throws(() => calculateDeliveryCost(MarleySpoonPlan, count));
  for (const changes of [
    { foodCents: -1 }, { foodCents: 80.94 }, { shippingCents: NaN }, { foodCents: Number.MAX_SAFE_INTEGER },
    { foodDiscountPercentages: [] }, { foodDiscountPercentages: [-1] }, { foodDiscountPercentages: [101] }, { foodDiscountPercentages: [2.5] },
  ]) assert.throws(() => calculateDeliveryCost({ ...MarleySpoonPlan, ...changes }, 1));
  assert.throws(() => calculateDeliveryCost(null, 1));
});

test("publication requires the actual reviewed non-product owner and complete server-built link", () => {
  assert.equal(validateMarleySpoonLink(MarleySpoonLinkArtifact), MarleySpoonLinkArtifact.offer);
  assert.equal(MarleySpoonOffer.kind, "SUBSCRIPTION");
  assert.equal(MarleySpoonOffer.priceBasis, "PER_DELIVERY");
  assert.equal(MarleySpoonOffer.owningMerchantId, "7decef8b-9aef-4d97-a7f4-6eea83ede096");
  assert.equal(MarleySpoonOffer.productId, undefined);
  assert.equal(MarleySpoonOffer.productVariantId, undefined);
  assert.throws(() => validateMarleySpoonLink(null), /before publication/);
  const invalidChanges = [
    artifact => { delete artifact.offer; },
    artifact => { delete artifact.provenance; },
    artifact => { artifact.channel = "OTHER_ASSISTANT"; },
    artifact => { artifact.conversationId = "synthetic-conversation"; },
    artifact => { artifact.offer.kind = "PRODUCT"; },
    artifact => { artifact.offer.priceBasis = "PER_MONTH"; },
    artifact => { artifact.offer.owningMerchantId = "00000000-0000-4000-8000-000000000001"; },
    artifact => { artifact.offer.productVariantId = "fake-product"; },
    artifact => { artifact.offer.paidLink = false; },
    artifact => { artifact.offer.plain = artifact.offer.plain.replace("USMSAFFAWIN363M26", "wrong-code"); },
    artifact => { artifact.offer.paid = artifact.offer.paid.replace("awinmid=6988", "awinmid=1"); },
    artifact => { artifact.offer.paid = artifact.offer.paid.replace("clickref=shop_nobi", "clickref=stale-ref"); },
    artifact => { artifact.offer.paid = "invalid"; },
  ];
  for (const change of invalidChanges) {
    const altered = structuredClone(MarleySpoonLinkArtifact);
    change(altered);
    assert.throws(() => validateMarleySpoonLink(altered), /before publication/);
  }
});
