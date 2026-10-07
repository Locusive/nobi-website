export const PRICING = Object.freeze({
  baseCents: 2500,
  includedSearches: 2500,
  includedMessages: 250,
  searchCents: 1,
  messageCents: 10,
});

export const DEFAULT_ACTIVITY = Object.freeze({ visitors: 50000, searchesPerHundred: 3.5, messagesPerHundred: 0.5 });
export const MAX_USAGE = 100_000_000;

function numberInRange(value, max, integer = true) {
  if (value == null || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= max && (!integer || Number.isInteger(number)) ? number : null;
}

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

export function priceUsage({ searches, messages }) {
  if (numberInRange(searches, MAX_USAGE) === null || numberInRange(messages, MAX_USAGE) === null) throw new RangeError("Usage must be a nonnegative whole count.");
  const additionalSearches = Math.max(0, searches - PRICING.includedSearches);
  const additionalMessages = Math.max(0, messages - PRICING.includedMessages);
  const searchCostCents = additionalSearches * PRICING.searchCents;
  const messageCostCents = additionalMessages * PRICING.messageCents;
  return { additionalSearches, additionalMessages, searchCostCents, messageCostCents, totalCents: PRICING.baseCents + searchCostCents + messageCostCents };
}

export function formatPrice(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(cents / 100);
}
