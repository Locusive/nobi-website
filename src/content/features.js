import { BarChart3, Filter, Keyboard, LifeBuoy, Lightbulb, MessageCircle, Search, ShoppingCart, SlidersHorizontal, Sparkles, UserPlus, Workflow, Zap } from "lucide-react";

// Every Nobi feature the website shows. The Product menu, feature pages, All features page and prerender build read it.
// Every claim was checked against the Nobi code; check again before changing one.

export const FeatureGroupId = {
  Search: "search",
  Support: "support",
  Ecommerce: "ecommerce",
  Engagement: "engagement",
  Insights: "insights",
};

/** The groups the Product menu and the All features page use, in display order.
 *  closing is the footer copy for the group's feature pages; without it they use the site's search footer. */
export const FEATURE_GROUPS = [
  {
    id: FeatureGroupId.Search,
    name: "Search",
    summary: "Search that understands what people mean, answers their questions, and shows what you choose.",
    closing: { heading: "Give your visitors search that gets them.", body: "Replace keyword search with AI that understands what people are looking for, and watch more of them convert." },
  },
  {
    id: FeatureGroupId.Support,
    name: "Automated support",
    summary: "Answer every question, on every page, from your own content.",
    closing: { heading: "Answer every visitor.", body: "Give visitors answers any time, and a way to reach your team when they need one." },
  },
  {
    id: FeatureGroupId.Ecommerce,
    name: "Ecommerce",
    summary: "Help shoppers find the right product and add more to the cart, from the collection page to checkout.",
    closing: { heading: "Help shoppers buy with confidence.", body: "Guide shoppers to the right product and the right next one, from the collection page to the cart." },
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
 *  icon is the lucide glyph beside the name; enterprise marks features the Nobi team sets up for a store. */
export const FEATURES = [
  { slug: "ai-search", group: FeatureGroupId.Search, name: "AI search", icon: Search, menuLine: "Results that match what people mean" },
  { slug: "search-as-you-type", group: FeatureGroupId.Search, name: "Typeahead search", icon: Keyboard, menuLine: "Suggestions and products as they type" },
  { slug: "smart-answers", group: FeatureGroupId.Search, name: "AI answers", icon: Sparkles, menuLine: "An answer, products and pages in one" },
  { slug: "merchandising", group: FeatureGroupId.Search, name: "Merchandising", icon: SlidersHorizontal, menuLine: "Pin, boost, bury and hide results" },
  { slug: "automated-support", group: FeatureGroupId.Support, name: "Support agent", icon: LifeBuoy, menuLine: "Resolves questions and hands off to your team" },
  { slug: "product-page-qa", group: FeatureGroupId.Support, name: "Product Q&A", icon: MessageCircle, menuLine: "Searchable shopper questions on each product", enterprise: true },
  { slug: "product-recommendations", group: FeatureGroupId.Ecommerce, name: "Product recommendations", icon: Lightbulb, menuLine: "Related products on product pages and in the cart", enterprise: true },
  { slug: "cart-assistant", group: FeatureGroupId.Ecommerce, name: "Cart assistant", icon: ShoppingCart, menuLine: "A message and suggestions in the cart", enterprise: true },
  { slug: "ask-ai-filters", group: FeatureGroupId.Ecommerce, name: "AI filters", icon: Filter, menuLine: "Shoppers describe it, Nobi sets the filters" },
  { slug: "lead-capture", group: FeatureGroupId.Engagement, name: "Lead capture", icon: UserPlus, menuLine: "Collects contact details and routes every lead" },
  { slug: "proactive-prompts", group: FeatureGroupId.Engagement, name: "Proactive outreach", icon: Zap, menuLine: "Reaches out at the right moment" },
  { slug: "custom-actions", group: FeatureGroupId.Engagement, name: "Custom actions", icon: Workflow, menuLine: "Runs real actions, like booking a test drive" },
  { slug: "insights", group: FeatureGroupId.Insights, name: "Insights", icon: BarChart3, menuLine: "What customers search for, click and buy" },
];

/** Lists the features in one group, in menu order. */
export function listFeaturesInGroup(groupId) {
  return FEATURES.filter((feature) => feature.group === groupId);
}

/** Finds one feature by its page address slug, or undefined when no feature has that slug. */
export function findFeature(slug) {
  return FEATURES.find((feature) => feature.slug === slug);
}
