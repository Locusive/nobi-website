/** Formats cents as dollars, such as "$25" or "$2,999.03". */
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
