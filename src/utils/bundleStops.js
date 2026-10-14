import { LARGEST_BUNDLE, MESSAGE_BUNDLES } from "../constants/pricing.js";
import { formatCount, formatPrice, formatPricePerMessage } from "./pricingEstimate.js";

/** Describes one bundle as a stop on the pricing page slider. */
function describeBundle(bundle) {
  const messages = formatCount(bundle.messages);
  const price = formatPrice(bundle.priceCents);
  return {
    custom: false,
    messages,
    price,
    pricePerMessage: formatPricePerMessage(bundle),
    valueText: `${messages} messages for ${price} a month`,
  };
}

const CUSTOM_STOP = Object.freeze({
  custom: true,
  messages: `Over ${formatCount(LARGEST_BUNDLE.messages)}`,
  valueText: `Over ${formatCount(LARGEST_BUNDLE.messages)} messages, custom pricing`,
});

/** The slider stops: one per bundle, smallest first, then one stop for custom pricing. */
export const BUNDLE_STOPS = Object.freeze([...MESSAGE_BUNDLES.map(describeBundle), CUSTOM_STOP]);
