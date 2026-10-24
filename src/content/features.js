// Every Nobi feature the website shows. The Product menu, feature pages, All features page and prerender build read it.
// Every claim was checked against the Nobi code; check again before changing one.

export const FeatureGroupId = {
  Search: "search",
  Merchandising: "merchandising",
  Support: "support",
  Engagement: "engagement",
  Insights: "insights",
};

/** The groups the Product menu and the All features page use, in display order.
 *  closing is the footer copy for the group's feature pages; without it they use the site's search footer. */
export const FEATURE_GROUPS = [
  {
    id: FeatureGroupId.Search,
    name: "Search",
    summary: "Search that understands what shoppers mean, not just the words they type.",
    closing: { heading: "Give your visitors search that gets them.", body: "Replace keyword search with AI that understands what shoppers are looking for, and watch more of them convert." },
  },
  {
    id: FeatureGroupId.Merchandising,
    name: "Merchandising",
    summary: "Control what shows in results, and put the right products in front of shoppers.",
    closing: { heading: "Put the right products forward.", body: "Shape your results and recommend what shoppers are most likely to buy, with no code." },
  },
  {
    id: FeatureGroupId.Support,
    name: "Support",
    summary: "Answer every question, on every page, from your own content.",
    closing: { heading: "Answer every visitor.", body: "Give visitors answers any time, and a way to reach your team when they need one." },
  },
  {
    id: FeatureGroupId.Engagement,
    name: "Leads & engagement",
    summary: "Start the conversation at the right moment, and turn it into a lead.",
    closing: { heading: "Turn visitors into conversations.", body: "Reach out at the right moment, answer what they ask, and send every lead to the right team." },
  },
  {
    id: FeatureGroupId.Insights,
    name: "Insights",
    summary: "See what your customers search for, click and buy.",
    featured: true,
    closing: { heading: "Know what your customers want.", body: "See what they search for and what converts, and act on it." },
  },
];

/** The address of the page that lists every feature. */
export const ALL_FEATURES_PATH = "/product";

/** The address of one feature's own page. */
export function buildFeaturePath(slug) {
  return `${ALL_FEATURES_PATH}/${slug}`;
}

/** The features, in menu order within each group. menuLine is the line under the name in the menu.
 *  enterprise marks features the Nobi team sets up for a store; the rest of Nobi is self-service. */
export const FEATURES = [
  { slug: "ai-search", group: FeatureGroupId.Search, name: "AI search", menuLine: "Results that match what shoppers mean" },
  { slug: "search-as-you-type", group: FeatureGroupId.Search, name: "Search as you type", menuLine: "Suggestions and products as they type" },
  { slug: "shopify-search-page", group: FeatureGroupId.Search, name: "Shopify search page", menuLine: "Nobi runs your full Shopify search page" },
  { slug: "merchandising", group: FeatureGroupId.Merchandising, name: "Merchandising", menuLine: "Pin, boost, bury and hide results" },
  { slug: "product-recommendations", group: FeatureGroupId.Merchandising, name: "Product recommendations", menuLine: "Related products on product pages and in the cart", enterprise: true },
  { slug: "cart-assistant", group: FeatureGroupId.Merchandising, name: "Cart assistant", menuLine: "A message and suggestions in the cart", enterprise: true },
  { slug: "automated-support", group: FeatureGroupId.Support, name: "Automated support", menuLine: "Answers questions from your own content" },
  { slug: "site-answers", group: FeatureGroupId.Support, name: "Answers from your site", menuLine: "Cited answers from your pages and FAQs" },
  { slug: "product-page-qa", group: FeatureGroupId.Support, name: "Product page Q&A", menuLine: "Searchable shopper questions on each product", enterprise: true },
  { slug: "lead-capture", group: FeatureGroupId.Engagement, name: "Lead capture", menuLine: "Collects contact details and routes every lead" },
  { slug: "proactive-prompts", group: FeatureGroupId.Engagement, name: "Proactive engagement", menuLine: "Reaches out at the right moment" },
  { slug: "custom-actions", group: FeatureGroupId.Engagement, name: "Custom actions", menuLine: "Runs real actions on your site, like booking" },
  { slug: "insights", group: FeatureGroupId.Insights, name: "Insights", menuLine: "What customers search for, click and buy" },
];

/** Lists the features in one group, in menu order. */
export function listFeaturesInGroup(groupId) {
  return FEATURES.filter((feature) => feature.group === groupId);
}

/** Finds one feature by its page address slug, or undefined when no feature has that slug. */
export function findFeature(slug) {
  return FEATURES.find((feature) => feature.slug === slug);
}
