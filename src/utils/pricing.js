import { STANDARD_PLAN } from '../constants/pricing.js';

export const MAX_ESTIMATE_COUNT = 10_000_000;

/** Normalize editable counts before using them in an estimate or analytics. */
export function normalizeCount(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(MAX_ESTIMATE_COUNT, Math.max(0, Math.round(number))) : 0;
}

/** Apply each allowance independently and calculate in cents to preserve penny overages. */
export function estimateMonthlyCost(searches, messages) {
  const searchOverage = Math.max(0, normalizeCount(searches) - STANDARD_PLAN.includedSearches);
  const messageOverage = Math.max(0, normalizeCount(messages) - STANDARD_PLAN.includedMessages);
  const searchCostCents = searchOverage * STANDARD_PLAN.searchCents;
  const messageCostCents = messageOverage * STANDARD_PLAN.messageCents;
  return {
    searchOverage, messageOverage, searchCostCents, messageCostCents,
    totalCents: STANDARD_PLAN.monthlyCents + searchCostCents + messageCostCents,
  };
}

/** Rates are requests per 100 visits, so repeat requests are counted as well. */
export function estimateUsageFromVisits(visits, searchesPer100, messagesPer100) {
  const count = normalizeCount(visits);
  const rate = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  return {
    searches: normalizeCount(count * rate(searchesPer100) / 100),
    messages: normalizeCount(count * rate(messagesPer100) / 100),
  };
}

export function money(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
