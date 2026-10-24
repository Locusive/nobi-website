// Page copy for the Recommendations features. Every claim was checked against the Nobi code.
// theme names a color in PanelTheme. benefits is the "why it helps" story; worksFor shows it across industries.

export const ECOMMERCE_FEATURE_PAGES = {
  "product-recommendations": {
    seoTitle: "AI Product Recommendations | Nobi",
    seoDescription: "Nobi shows related products on your product pages and in the cart, chosen by AI for the product being viewed.",
    theme: "Amber",
    headline: "The right next product",
    headlineMaxCh: 11,
    intro: "Nobi shows related products on your product pages and in the cart, chosen by AI for the product the shopper is looking at.",
    benefits: [
      { title: "Bigger orders", body: "A shopper looking at one product sees the two or three that go with it, right where they're deciding." },
      { title: "Chosen, not generic", body: "AI picks what actually complements the product, not a random “you may also like” row." },
      { title: "Always in stock", body: "Out-of-stock items are dropped, so every recommendation is something a shopper can buy." },
    ],
    steps: [
      { title: "Our team sets it up", body: "We place the recommendations on your product pages and in your cart." },
      { title: "Nobi picks the products", body: "For each product, Nobi chooses related items from your catalog." },
      { title: "Shoppers see more to buy", body: "Recommendations appear where shoppers are already deciding." },
    ],
    worksFor: [
      { vertical: "Retail", body: "A dress shows the shoes, bag and wrap that finish the look." },
      { vertical: "Auto dealers", body: "A truck page surfaces the bed liner, tow package and floor mats that go with it." },
    ],
  },
  "cart-assistant": {
    seoTitle: "AI Cart Assistant | Nobi",
    seoDescription: "When a shopper adds something to the cart, Nobi shows a short message and related products, right in the cart.",
    theme: "Magenta",
    headline: "Help that shows up in the cart",
    headlineMaxCh: 12,
    intro: "When a shopper adds something to the cart, Nobi opens with a short message and related products, right where they are about to check out.",
    benefits: [
      { title: "The last-minute add-on", body: "A relevant suggestion in the cart is the easiest upsell a shopper will ever take." },
      { title: "Catches second thoughts", body: "A shopper with a question at checkout can ask it right there, instead of abandoning the cart." },
      { title: "Timed to the moment", body: "It appears the instant something is added, when the shopper is most ready to add one more." },
    ],
    steps: [
      { title: "Our team sets it up", body: "We connect Nobi to your cart." },
      { title: "A shopper adds a product", body: "Nobi writes a short message about what they chose." },
      { title: "Related products appear", body: "Shoppers can add one more item, or ask a question before checking out." },
    ],
    worksFor: [
      { vertical: "Retail", body: "Add a dress and the cart suggests the matching shoes before checkout." },
      { vertical: "Services", body: "Add a service and Nobi suggests the add-on most customers book with it." },
    ],
    proof: { customer: "Lucchese", stat: "8.5x", detail: "return on investment from the cart assistant, with $108K in revenue since it launched.", storyPath: "/customers/lucchese" },
  },
};
