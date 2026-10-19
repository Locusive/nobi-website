import { GiftChooserProducts } from "../content/giftChooserProducts.js";

/** The supported interest choices and existing collection destinations. */
export const GiftInterests = Object.freeze({
  coffee: { label: "Coffee drinker", request: "someone who drinks instant coffee", collection: "https://nobi.ai/shop/s/instant-coffee" },
  painting: { label: "Someone who paints", request: "someone who already paints", collection: "https://nobi.ai/shop/s/silver-paint-brushes" },
  charging: { label: "Someone with charging clutter", request: "someone who wants a useful charging accessory", collection: "https://nobi.ai/shop/s/black-chargers" },
});

const MaxItemBudget = 5000;
const OptionLimit = 3;

/** Read the actual native form data, ignoring preferences that do not apply to the selected interest. */
export function readGiftChoice(formData) {
  const interest = String(formData.get("interest") || "");
  return {
    interest,
    budget: Number(formData.get("budget")),
    decafOnly: interest === "coffee" && formData.get("decafOnly") === "on",
    shortHandlesOnly: interest === "painting" && formData.get("shortHandlesOnly") === "on",
    avoidDeviceChecks: formData.get("avoidDeviceChecks") === "on",
  };
}

/** Select up to three reviewed examples on explicit submission; never broaden constraints to fill empty results. */
export function chooseGifts(choice) {
  if (!Object.hasOwn(GiftInterests, choice.interest)) {
    return { error: "Choose an interest they already enjoy.", items: [] };
  }
  if (!Number.isFinite(choice.budget) || choice.budget < 1 || choice.budget > MaxItemBudget) {
    return { error: "Enter an item budget from $1 to $5,000 before tax and shipping.", items: [] };
  }
  const matches = GiftChooserProducts.filter(product => product.interest === choice.interest
    && product.price <= choice.budget
    && (!choice.decafOnly || product.decaf)
    && (!choice.shortHandlesOnly || product.shortHandle)
    && (!choice.avoidDeviceChecks || !product.needsDeviceCheck));
  return {
    error: null,
    choice,
    interest: GiftInterests[choice.interest],
    items: matches.slice(0, OptionLimit),
    matchingCount: matches.length,
    request: buildGiftRequest(choice),
    shopUrl: "https://nobi.ai/shop",
  };
}

/** Make an editable shopping request; the supported /shop link does not submit or prefill it automatically. */
export function buildGiftRequest(choice) {
  const interest = GiftInterests[choice.interest];
  const preferences = [
    choice.decafOnly && "decaf only",
    choice.shortHandlesOnly && "short-handled brushes only",
    choice.avoidDeviceChecks && "avoid gifts that need device-compatibility checks",
  ].filter(Boolean);
  return `Help me choose a gift for ${interest.request}, up to $${choice.budget} per item before tax and shipping.${preferences.length ? ` Preferences: ${preferences.join("; ")}.` : ""} Explain why each option fits and what I should check before buying.`;
}
