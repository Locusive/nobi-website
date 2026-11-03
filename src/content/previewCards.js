// What each page's link preview picture says. A page listed here gets its own card under /media/og instead of the
// site-wide picture, so a shared link shows that page rather than the home page.

const BaseUrl = "https://nobi.ai";

/** The site-wide picture, used by the home page and anything with no card of its own. */
export const DefaultPreviewImage = `${BaseUrl}/og-image.png`;

const feature = (headline, summary) => ({ eyebrow: "Feature", headline, summary });
const story = (headline, summary, logo) => ({ eyebrow: "Customer story", headline, summary, logo });
const tool = (headline, summary) => ({ eyebrow: "Free tool", headline, summary });
const post = (headline, summary) => ({ eyebrow: "Blog", headline, summary });

// Each page's card, by path. The summaries are the pages' own meta descriptions, cut to read at preview size.
// After adding or changing one, run scripts/render-preview-images.mjs and commit the picture it draws.

// A page that already has a hero or one big main picture should name it as heroImage instead, and it is shared as
// it is. Blog posts do this through their frontmatter, and Shop Nobi pages through their first product's picture.
export const PREVIEW_CARDS = Object.freeze({
  "/pricing": {
    eyebrow: "Pricing",
    headline: "Message bundles from $29",
    summary: "A search or a chat question each count as one message. Try Nobi free with 100 messages every month, no credit card needed.",
  },
  "/about": {
    eyebrow: "About",
    headline: "About Shop Nobi",
    summary: "Shop Nobi is the shopping search from Nobi, operated by Locusive, Inc. Find products across stores and buy directly from the retailer.",
  },
  "/privacy": {
    eyebrow: "Legal",
    headline: "Privacy Policy",
    summary: "How Nobi collects, uses, and protects your data.",
  },
  "/terms": {
    eyebrow: "Legal",
    headline: "Terms of Service",
    summary: "The terms governing use of Nobi's AI assistant products and Shop Nobi.",
  },

  "/customers": {
    eyebrow: "Customer stories",
    headline: "Real results from real brands",
    summary: "See how Lucchese, UNTUCKit, and Kilte use Nobi's AI search to generate measurable revenue lift.",
  },
  "/customers/untuckit": story(
    "UNTUCKit: +21.3% revenue per searcher",
    "A two-month pilot. A clear result. UNTUCKit saw +17.1% conversion rate lift, then went all in on Nobi.",
    "media/logos/untuckit.svg"
  ),
  "/customers/lucchese": story(
    "Lucchese generated $1M+ with Nobi",
    "$1M+ incremental revenue, 33x ROI, +22.9% checkout completion. How Lucchese transformed search with Nobi.",
    "media/logos/lucchese.svg"
  ),
  "/customers/kilte": story(
    "Kilte: 21.7% more conversions",
    "Kilte uses evocative color names like Cappuccino and Ivory. Nobi maps them to what shoppers actually search for.",
    "media/logos/kilte.webp"
  ),

  "/product": {
    eyebrow: "Product",
    headline: "Every Nobi feature in one place",
    summary: "AI search, merchandising and search analytics, an assistant for support and lead capture, and ecommerce features from product pages to the cart.",
  },
  "/product/ai-search": feature(
    "AI Search",
    "Nobi's AI search understands what visitors mean, not only the words they type, so long, plain-language searches find the right results."
  ),
  "/product/ai-connectors": feature(
    "ChatGPT and Claude Connectors",
    "Nobi puts your store inside ChatGPT and Claude, listed under your own name, answering from your own catalog and support pages."
  ),
  "/product/ask-ai-filters": feature(
    "AI Filters",
    "Shoppers describe what they want in plain words, and Nobi sets the filters on your collection or search page for them."
  ),
  "/product/automated-support": feature(
    "AI Support Agent",
    "Nobi answers from your content, looks up product details, compares products, and hands off to your team when it can't."
  ),
  "/product/cart-assistant": feature(
    "AI Cart Assistant",
    "When a shopper adds something to the cart, Nobi shows a short message and related products, right in the cart."
  ),
  "/product/custom-actions": feature(
    "Custom Actions",
    "Developers can give Nobi actions to run on your site, like opening a booking form, so visitors get things done in the conversation."
  ),
  "/product/insights": feature(
    "Customer Insights",
    "See what your customers search for, which products they click and buy, what is trending, and what they ask about."
  ),
  "/product/lead-capture": feature(
    "AI Lead Capture",
    "Nobi collects contact details during a conversation, tells sales requests from service requests, and emails each lead to the right team."
  ),
  "/product/merchandising": feature(
    "Search Merchandising",
    "Pin, boost, bury or hide products in Nobi search results, and send any search to the right page, without writing code."
  ),
  "/product/proactive-prompts": feature(
    "Proactive Outreach",
    "Nobi starts the conversation when a visitor is about to leave, stops scrolling, comes back, or arrives from a search engine."
  ),
  "/product/product-page-qa": feature(
    "Product Q&A",
    "Nobi shows past shopper questions and answers on each product page, and lets shoppers search them before they ask."
  ),
  "/product/product-recommendations": feature(
    "AI Product Recommendations",
    "Nobi shows related products on your product pages and in the cart, chosen by AI for the product being viewed."
  ),
  "/product/search-as-you-type": feature(
    "Typeahead Search",
    "Nobi suggests searches and shows matching products with pictures while people type, so they find what they want in fewer keystrokes."
  ),
  "/product/smart-answers": feature(
    "AI Answers",
    "One search, one screen: Nobi shows a plain-language AI answer alongside the products and the pages it came from."
  ),

  "/tools/duvet-cover-size": tool(
    "Duvet Cover & Insert Size Calculator",
    "Compare your duvet insert with up to three covers in inches or centimetres, then check the maker's fit guidance."
  ),
  "/tools/gift-budget": tool(
    "Gift Budget Calculator",
    "Subtract your total shipping, tax and wrapping estimates, then split the remaining gift budget in cents."
  ),
  "/tools/gift-chooser": tool(
    "Choose a Useful Gift",
    "Start with a known interest, item budget and a few preferences. Compare reviewed gift examples with clear reasons and tradeoffs."
  ),
  "/tools/phone-case-check": tool(
    "Phone Case Model & Charging Checklist",
    "Check the exact phone model and selected case variant, then record separate charging and accessory evidence."
  ),
  "/tools/usb-c-power-check": tool(
    "USB-C Shared Power Checker",
    "Compare two device wattage targets with a charger's documented simultaneous port outputs, before buying."
  ),
  "/gift-guides": {
    eyebrow: "Gift guides",
    headline: "Choose by the person",
    summary: "Explore guides for someone who wants nothing, a headphone gift or a trivia game. Compare the fit before choosing.",
  },

  "/blog/gifts-for-someone-who-wants-nothing": post(
    "Gifts for someone who wants nothing",
    "Compare a favorite consumable, a useful replacement, hobby supplies, a gift card and time together."
  ),
  "/blog/headphones-as-a-gift": post(
    "Headphones as a gift: four checks",
    "Check the recipient's routine, devices, fit and delivery before you buy, and see the reasons to give choice instead."
  ),
  "/blog/how-to-split-a-gift-budget": post(
    "How to split a gift budget",
    "Reserve your shipping, tax and wrapping estimates first. Compare equal shares, uneven budgets and a seven-person example."
  ),
  "/blog/khaki-pants-fit-guide": post(
    "Women's khaki pants: compare the fit",
    "Compare tall and petite labels, capri lengths, tapered legs, wide legs and flares, with six dated listing examples."
  ),
  "/blog/product-search-api-for-shopping-apps": post(
    "Product search APIs for shopping apps",
    "Compare own-catalog search APIs with cross-store MCP tools, and see what an AI agent can actually use."
  ),
  "/blog/qcy": post(
    "QCY: audio options worth exploring",
    "QCY's audio story and a selected headphone option, with useful fit questions and direct links to explore the brand."
  ),
  "/blog/shopping-mcp-servers-for-ai-agents": post(
    "Shopping MCP servers for AI agents",
    "Compare Shop Nobi, Shopify Catalog, ShopSavvy and within. See catalog scope, setup, buying handoff and limits."
  ),
  "/blog/trivia-card-game-gift": post(
    "How to choose a trivia card game gift",
    "Check the age label, player count, play time and topics, and see when one option may fit your group."
  ),
});

/**
 * Turns a page path into its card's file name.
 *
 * @param {string} path The page path, such as "/product/ai-search".
 * @returns {string} The file's base name, such as "product-ai-search".
 */
export function previewCardSlug(path) {
  return path.replace(/^\//, "").replace(/\//g, "-") || "home";
}

/**
 * Returns the address of a page's own link preview picture. A page that already has a hero or main picture names it
 * as heroImage and shares that; the rest share the card drawn for them.
 *
 * @param {string} [path] The page path.
 * @returns {string | null} The picture's address, or null when the page has no picture of its own.
 */
export function previewImageUrl(path) {
  const card = path ? PREVIEW_CARDS[path] : null;
  if (!card) {
    return null;
  }
  if (card.heroImage) {
    return card.heroImage.startsWith("http") ? card.heroImage : `${BaseUrl}/${card.heroImage.replace(/^\//, "")}`;
  }
  return `${BaseUrl}/media/og/${previewCardSlug(path)}.png`;
}
