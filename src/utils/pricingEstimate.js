import { EXTRA_MESSAGE_CENTS, LARGEST_BUNDLE, MESSAGE_BUNDLES } from "../constants/pricing.js";

export const DEFAULT_ACTIVITY = Object.freeze({ visitors: 50000, searchesPerHundred: 3.5, messagesPerHundred: 0.5 });
export const DEFAULT_USAGE = Object.freeze({ searches: 400, messages: 100 });
export const MAX_USAGE = 100_000_000;

function numberInRange(value, max, integer = true) {
  if (value == null || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= max && (!integer || Number.isInteger(number)) ? number : null;
}

/** Turns calculator input into monthly search and chat counts, or null when the input is not valid. */
export function estimateUsage({ mode, basis, visitors, searches, messages, searchesPerHundred, messagesPerHundred }) {
  if (!["search", "assistant", "both"].includes(mode) || !["traffic", "usage"].includes(basis)) return null;
  const useSearch = mode !== "assistant";
  const useMessages = mode !== "search";
  if (basis === "usage") {
    const searchCount = useSearch ? numberInRange(searches, MAX_USAGE) : 0;
    const messageCount = useMessages ? numberInRange(messages, MAX_USAGE) : 0;
    return searchCount === null || messageCount === null ? null : { searches: searchCount, messages: messageCount };
  }
  const visits = numberInRange(visitors, 10_000_000);
  const searchRate = useSearch ? numberInRange(searchesPerHundred, 1000, false) : 0;
  const messageRate = useMessages ? numberInRange(messagesPerHundred, 1000, false) : 0;
  if (visits === null || searchRate === null || messageRate === null) return null;
  return { searches: Math.round(visits * searchRate / 100), messages: Math.round(visits * messageRate / 100) };
}

/** Returns the smallest bundle that holds this many messages, or null when it is above the largest bundle. */
export function smallestBundleFor(messageCount) {
  return MESSAGE_BUNDLES.find(bundle => messageCount <= bundle.messages) ?? null;
}

/**
 * Prices a month of use. Searches and chat questions are both messages, so they add up.
 * Above the largest bundle, the price is that bundle plus a fee for each extra message.
 */
export function priceUsage({ searches, messages }) {
  if (numberInRange(searches, MAX_USAGE) === null || numberInRange(messages, MAX_USAGE) === null) throw new RangeError("Usage must be a nonnegative whole count.");
  const totalMessages = searches + messages;
  const bundle = smallestBundleFor(totalMessages);
  if (bundle) return { totalMessages, bundle, extraMessages: 0, extraCostCents: 0, totalCents: bundle.priceCents, talkToSales: false };

  const extraMessages = totalMessages - LARGEST_BUNDLE.messages;
  const extraCostCents = extraMessages * EXTRA_MESSAGE_CENTS;
  return { totalMessages, bundle: LARGEST_BUNDLE, extraMessages, extraCostCents, totalCents: LARGEST_BUNDLE.priceCents + extraCostCents, talkToSales: true };
}

/** Formats cents as dollars, such as "$25" or "$25.21". */
export function formatPrice(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(cents / 100);
}

/** Formats a bundle's price per message in dollars with three decimals, such as "$0.035". */
export function formatPricePerMessage({ messages, priceCents }) {
  const tenthsOfACent = Math.round(priceCents * 10 / messages);
  return `$${(tenthsOfACent / 1000).toFixed(3)}`;
}

/** Formats a count with commas, such as "10,000". */
export function formatCount(count) {
  return Number(count).toLocaleString("en-US");
}
