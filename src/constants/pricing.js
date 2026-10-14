// Nobi's monthly message bundles. This is the only copy of the price list in the code.
// Prices are in cents so the math stays exact.
export const MESSAGE_BUNDLES = Object.freeze([
  { messages: 500, priceCents: 2_500 },
  { messages: 1_000, priceCents: 4_500 },
  { messages: 2_500, priceCents: 10_500 },
  { messages: 5_000, priceCents: 19_900 },
  { messages: 10_000, priceCents: 37_900 },
  { messages: 15_000, priceCents: 53_900 },
  { messages: 20_000, priceCents: 69_900 },
  { messages: 30_000, priceCents: 99_900 },
  { messages: 50_000, priceCents: 159_900 },
  { messages: 75_000, priceCents: 232_500 },
  { messages: 100_000, priceCents: 299_900 },
].map(bundle => Object.freeze(bundle)));

export const SMALLEST_BUNDLE = MESSAGE_BUNDLES[0];
export const LARGEST_BUNDLE = MESSAGE_BUNDLES[MESSAGE_BUNDLES.length - 1];

// Above the largest bundle, a store on "Keep going" pays this much for each extra message.
export const EXTRA_MESSAGE_CENTS = 3;

export const FREE_PREVIEW_MESSAGES = 100;
export const TRIAL_DAYS = 30;

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
