import assert from 'node:assert/strict';
import { test } from 'node:test';
import { estimateMonthlyCost, estimateUsageFromVisits, money } from '../src/utils/pricing.js';

test('the base includes both allowances and remains the minimum for every setup', () => {
  for (const [searches, messages] of [[0, 0], [2500, 0], [0, 250], [2500, 250]]) {
    assert.equal(estimateMonthlyCost(searches, messages).totalCents, 2500);
  }
});

test('each allowance applies independently, with no conversion of unused messages to searches', () => {
  assert.equal(estimateMonthlyCost(3000, 100).totalCents, 3000);
  assert.equal(estimateMonthlyCost(100, 300).totalCents, 3000);
  assert.deepEqual(estimateMonthlyCost(5000, 500), {
    searchOverage: 2500, messageOverage: 250, searchCostCents: 2500, messageCostCents: 2500, totalCents: 7500,
  });
});

test('a search and two assistant follow-ups beyond allowances add exactly 21 cents', () => {
  assert.equal(estimateMonthlyCost(2501, 252).totalCents, 2521);
  assert.equal(money(estimateMonthlyCost(2501, 250).totalCents), '$25.01');
  assert.equal(money(21), '$0.21');
  assert.equal(money(20), '$0.20');
});

test('traffic assumptions count requests, including more than one request per visit', () => {
  assert.deepEqual(estimateUsageFromVisits(100000, 3.5, 0.5), { searches: 3500, messages: 500 });
  assert.equal(estimateMonthlyCost(3500, 500).totalCents, 6000);
  assert.deepEqual(estimateUsageFromVisits(1000, 150, 200), { searches: 1500, messages: 2000 });
});

test('empty, invalid, and negative inputs never produce negative or nonfinite bills', () => {
  for (const value of ['', -1, NaN, Infinity, 'invalid']) {
    assert.equal(estimateMonthlyCost(value, value).totalCents, 2500);
    assert.deepEqual(estimateUsageFromVisits(value, 3.5, 0.5), { searches: 0, messages: 0 });
  }
});
