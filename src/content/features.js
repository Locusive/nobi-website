// Every Nobi feature the website shows. The Product menu, feature pages, All features page and prerender build read it.
// Every claim was checked against the Nobi code; check again before changing one.

export const FeatureGroupId = {
  Search: "search",
  Assistant: "assistant",
  Ecommerce: "ecommerce",
};

/** The three groups the Product menu and the All features page use, in display order.
 *  closing is the footer copy for the group's feature pages; without it they use the site's search footer. */
export const FEATURE_GROUPS = [
  { id: FeatureGroupId.Search, name: "Search", summary: "Search that understands what visitors mean, and the controls to shape it." },
  {
    id: FeatureGroupId.Assistant,
    name: "Assistant",
    summary: "An AI assistant that answers, follows up and captures leads, on any kind of site.",
    closing: { heading: "Answer every visitor.", body: "Give visitors answers any time, and a way to reach your team when they need one." },
  },
  {
    id: FeatureGroupId.Ecommerce,
    name: "Ecommerce",
    summary: "Features built for online stores, from product pages to the cart.",
    closing: { heading: "Help shoppers buy with confidence.", body: "Give shoppers answers and the right next product, from the product page to the cart." },
  },
];

/** The address of the page that lists every feature. */
export const ALL_FEATURES_PATH = "/product";

/** The address of one feature's own page. */
export function buildFeaturePath(slug) {
  return `${ALL_FEATURES_PATH}/${slug}`;
}

/** The features, in menu order. menuLine is the line under the name in the menu.
 *  enterprise marks features the Nobi team sets up for a store; the rest of Nobi is self-service. */
export const FEATURES = [
  { slug: "ai-search", group: FeatureGroupId.Search, name: "AI search", menuLine: "Results that match what visitors mean" },
  { slug: "search-as-you-type", group: FeatureGroupId.Search, name: "Search as you type", menuLine: "Suggestions and products with every keystroke" },
  { slug: "shopify-search-page", group: FeatureGroupId.Search, name: "Shopify search page", menuLine: "Nobi runs your full search results page" },
  { slug: "site-answers", group: FeatureGroupId.Search, name: "Answers from your site", menuLine: "Cited answers from your pages and FAQs" },
  { slug: "merchandising", group: FeatureGroupId.Search, name: "Merchandising", menuLine: "Pin, boost, bury and hide results" },
  { slug: "search-analytics", group: FeatureGroupId.Search, name: "Search analytics", menuLine: "What visitors search for, and what sells" },
  { slug: "remarketing", group: FeatureGroupId.Search, name: "Remarketing", menuLine: "Send searches to Meta and Google Tag Manager" },
  { slug: "automated-support", group: FeatureGroupId.Assistant, name: "Automated support", menuLine: "Answers questions, then hands off to your team" },
  { slug: "lead-capture", group: FeatureGroupId.Assistant, name: "Lead capture", menuLine: "Collects contact details and routes every lead" },
  { slug: "proactive-prompts", group: FeatureGroupId.Assistant, name: "Proactive prompts", menuLine: "Starts the conversation at the right moment" },
  { slug: "custom-actions", group: FeatureGroupId.Assistant, name: "Custom actions", menuLine: "Lets Nobi run actions on your site" },
  { slug: "any-language", group: FeatureGroupId.Assistant, name: "Any language", menuLine: "Replies in the language visitors write in" },
  { slug: "product-recommendations", group: FeatureGroupId.Ecommerce, name: "Product recommendations", menuLine: "Related products on product pages and in the cart", enterprise: true },
  { slug: "product-page-qa", group: FeatureGroupId.Ecommerce, name: "Product page Q&A", menuLine: "Searchable shopper questions on every product", enterprise: true },
  { slug: "cart-assistant", group: FeatureGroupId.Ecommerce, name: "Cart assistant", menuLine: "A message and suggestions when shoppers add to cart", enterprise: true },
  { slug: "ask-ai-filters", group: FeatureGroupId.Ecommerce, name: "Ask AI filters", menuLine: "Shoppers describe it, Nobi sets the filters", enterprise: true },
  { slug: "quick-add", group: FeatureGroupId.Ecommerce, name: "One-click add to cart", menuLine: "Add to cart straight from search results" },
];

/** Lists the features in one group, in menu order. */
export function listFeaturesInGroup(groupId) {
  return FEATURES.filter((feature) => feature.group === groupId);
}

/** Finds one feature by its page address slug, or undefined when no feature has that slug. */
export function findFeature(slug) {
  return FEATURES.find((feature) => feature.slug === slug);
}
