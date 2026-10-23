// The page copy for the Ecommerce features. Every claim was checked against the Nobi code; check again before changing one.
// theme names a color in PanelTheme, and headlineMaxCh caps the headline's line length.

export const ECOMMERCE_FEATURE_PAGES = {
  "product-recommendations": {
    seoTitle: "AI Product Recommendations | Nobi",
    seoDescription: "Nobi shows related products on your product pages and in the cart, chosen by AI for the product being viewed.",
    theme: "Amber",
    headline: "The right next product",
    headlineMaxCh: 11,
    intro: "Nobi shows related products on your product pages and in the cart, chosen by AI for the product the shopper is looking at.",
    steps: [
      { title: "Our team sets it up", body: "We place the recommendations on your product pages and in your cart." },
      { title: "Nobi picks the products", body: "For each product, Nobi chooses related items from your catalog." },
      { title: "Shoppers see more to buy", body: "Recommendations appear where shoppers are already deciding." },
    ],
  },
  "product-page-qa": {
    seoTitle: "Product Page Q&A | Nobi",
    seoDescription: "Nobi shows past shopper questions and answers on each product page, and lets shoppers search them.",
    theme: "Navy",
    headline: "Every question, answered on the page",
    headlineMaxCh: 13,
    intro: "Each product page shows the questions other shoppers asked about it, with answers. Shoppers can search them before they ask their own.",
    steps: [
      { title: "Our team sets it up", body: "We add the questions panel to your product pages." },
      { title: "Shoppers' questions are collected", body: "Questions about a product, and their answers, are kept with that product." },
      { title: "The next shopper finds the answer", body: "They search past questions right on the product page." },
    ],
  },
  "cart-assistant": {
    seoTitle: "AI Cart Assistant | Nobi",
    seoDescription: "When a shopper adds something to the cart, Nobi shows a short message and related products, right in the cart.",
    theme: "Magenta",
    headline: "Help that shows up in the cart",
    headlineMaxCh: 12,
    intro: "When a shopper adds something to the cart, Nobi opens with a short message and related products, right where they are about to check out.",
    steps: [
      { title: "Our team sets it up", body: "We connect Nobi to your cart." },
      { title: "A shopper adds a product", body: "Nobi writes a short message about what they chose." },
      { title: "Related products appear", body: "Shoppers can add one more item, or ask a question before checking out." },
    ],
    proof: { customer: "Lucchese", stat: "8.5x", detail: "return on investment from the cart assistant, with $108K in revenue since it launched.", storyPath: "/customers/lucchese" },
  },
  "ask-ai-filters": {
    seoTitle: "Ask AI Filters | Nobi",
    seoDescription: "Shoppers describe what they want in plain words, and Nobi sets the filters on your collection or search page for them.",
    theme: "Violet",
    headline: "Describe it, and the filters set themselves",
    headlineMaxCh: 13,
    intro: "Shoppers type what they want, like “red dress, size medium, under $150”, and Nobi sets your page's own filters to match.",
    steps: [
      { title: "Our team sets it up", body: "We add the Ask AI field to your collection or search pages." },
      { title: "A shopper describes what they want", body: "In plain words, the way they would ask a person in your store." },
      { title: "Your filters update", body: "Nobi turns the request into your page's filters, and the results update." },
    ],
  },
  "quick-add": {
    seoTitle: "One-Click Add to Cart | Nobi",
    seoDescription: "Shoppers add products to their cart straight from Nobi search results, without opening the product page.",
    theme: "Teal",
    headline: "Add to cart, straight from search",
    headlineMaxCh: 12,
    intro: "Shoppers add products to their cart right from the search results. Fewer steps between finding a product and buying it.",
    steps: [
      { title: "A shopper finds a product", body: "In Nobi search results or in the assistant." },
      { title: "They choose an option", body: "Pick a size or color when the product has them." },
      { title: "It goes in the cart", body: "The product is added without leaving the results." },
    ],
  },
};
