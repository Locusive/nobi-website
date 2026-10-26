import { formatCount, formatPrice } from "../utils/priceFormat.js";

// Nobi's monthly message bundles. This is the only copy of the price list in the code.
// Prices are in cents so the math stays exact.
export const MESSAGE_BUNDLES = Object.freeze([
  { messages: 500, priceCents: 2_900 },
  { messages: 1_000, priceCents: 5_500 },
  { messages: 2_500, priceCents: 12_900 },
  { messages: 5_000, priceCents: 24_900 },
  { messages: 10_000, priceCents: 46_900 },
  { messages: 15_000, priceCents: 66_900 },
  { messages: 20_000, priceCents: 86_900 },
  { messages: 30_000, priceCents: 124_900 },
  { messages: 50_000, priceCents: 199_900 },
  { messages: 75_000, priceCents: 289_900 },
  { messages: 100_000, priceCents: 374_900 },
].map(bundle => Object.freeze(bundle)));

export const SMALLEST_BUNDLE = MESSAGE_BUNDLES[0];
export const LARGEST_BUNDLE = MESSAGE_BUNDLES[MESSAGE_BUNDLES.length - 1];

// The span of bundle prices, for copy such as "Bundles go from $29 for 500 messages to ...".
export const BUNDLE_RANGE = `from ${formatPrice(SMALLEST_BUNDLE.priceCents)} for ${formatCount(SMALLEST_BUNDLE.messages)} messages to ${formatPrice(LARGEST_BUNDLE.priceCents)} for ${formatCount(LARGEST_BUNDLE.messages)} messages`;

// Above the largest bundle, a store on "Keep going" pays this much for each extra message.
export const EXTRA_MESSAGE_CENTS = 4;

export const FREE_PREVIEW_MESSAGES = 100;
export const TRIAL_DAYS = 30;

// The trial gives every store this many free messages, whatever bundle it picked.
export const TRIAL_MESSAGES = 100_000;
const TRIAL_MESSAGES_TEXT = TRIAL_MESSAGES.toLocaleString("en-US");

// The short trial line. Every place that mentions the trial states it.
export const TRIAL_SUMMARY = `${TRIAL_MESSAGES_TEXT} free messages during your ${TRIAL_DAYS}-day trial.`;

// How the trial limit works, for the going-over rules and the pricing FAQ.
export const TRIAL_LIMIT_RULE = `During your ${TRIAL_DAYS}-day free trial, you get ${TRIAL_MESSAGES_TEXT} free messages, whatever bundle you picked. Nobi stops at ${TRIAL_MESSAGES_TEXT} during the trial. After the trial, the bundle you picked applies.`;

/** The schema.org offer for pages that state Nobi's starting price: the smallest bundle. */
export const STARTING_OFFER = Object.freeze({
  "@type": "Offer",
  price: String(SMALLEST_BUNDLE.priceCents / 100),
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
});

/** The schema.org offer for the pricing page: one offer per bundle. */
export const PRICING_OFFER = Object.freeze({
  "@type": "AggregateOffer",
  priceCurrency: "USD",
  lowPrice: String(SMALLEST_BUNDLE.priceCents / 100),
  highPrice: String(LARGEST_BUNDLE.priceCents / 100),
  offerCount: MESSAGE_BUNDLES.length,
  availability: "https://schema.org/InStock",
  url: "https://nobi.ai/pricing",
  offers: MESSAGE_BUNDLES.map(({ messages, priceCents }) => ({
    "@type": "Offer",
    name: `${messages.toLocaleString("en-US")} messages a month`,
    price: String(priceCents / 100),
    priceCurrency: "USD",
  })),
});

export const PRICING_SEO_DESCRIPTION = `Monthly message bundles from $${SMALLEST_BUNDLE.priceCents / 100} for ${SMALLEST_BUNDLE.messages} messages. A search or a chat question each count as one message. Try Nobi free in your dashboard with ${FREE_PREVIEW_MESSAGES} free messages every month, no credit card needed.`;
