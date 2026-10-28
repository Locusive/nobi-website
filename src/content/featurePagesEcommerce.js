// Page copy for the Ecommerce features. Every claim was checked against the Nobi code.
// theme names a color in PanelTheme. benefits is "why it matters"; subFeatures is "what's included"; worksFor shows industries.

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
    subFeatures: [
      { title: "On the product page", body: "A “goes well with” row appears on the product page, with related items and suggestion prompts." },
      { title: "In the cart", body: "After a shopper adds something, the cart shows the items that complete the order." },
      { title: "Picked by AI, per product", body: "For each product, Nobi chooses complementary items from your catalog, so the picks make sense together." },
    ],
    steps: [
      { title: "Our team sets it up", body: "We place the recommendations on your product pages and in your cart." },
      { title: "Nobi picks the products", body: "For each product, Nobi chooses related items from your catalog." },
      { title: "Shoppers see more to buy", body: "Recommendations appear where shoppers are already deciding." },
    ],
    worksFor: [
      { vertical: "Retail", body: "A rain jacket shows the boots, daypack and watch that go with it." },
      { vertical: "Auto dealers", body: "A truck page surfaces the bed liner, tow package and floor mats that go with it." },
    ],
    faq: [
      { question: "Where do recommendations appear?", answer: "On your product pages and in the cart. Both are set up by the Nobi team with your page's layout in mind." },
      { question: "What are they based on?", answer: "The product the shopper is looking at. Nobi picks complementary items from your catalog for that product, and drops anything out of stock." },
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
    subFeatures: [
      { title: "A message on add to cart", body: "When something lands in the cart, Nobi opens with a short, relevant line instead of a silent drawer." },
      { title: "Complementary products", body: "A couple of items that go with what's in the cart, with quick add so they're one tap to include." },
      { title: "Answers in the cart", body: "A shopper can ask a question, about shipping or a product, without leaving checkout." },
    ],
    steps: [
      { title: "Our team sets it up", body: "We connect Nobi to your cart." },
      { title: "A shopper adds a product", body: "Nobi writes a short message about what they chose." },
      { title: "Related products appear", body: "Shoppers can add one more item, or ask a question before checking out." },
    ],
    worksFor: [
      { vertical: "Retail", body: "Add a pour-over kettle and the cart suggests the mugs and grinder that go with it." },
      { vertical: "Services", body: "Add a service and Nobi suggests the add-on most customers book with it." },
    ],
    proof: { customer: "Lucchese", stat: "8.5x", detail: "return on investment from the cart assistant, with $108K in revenue since it launched.", storyPath: "/customers/lucchese" },
    faq: [
      { question: "Does it slow down the cart?", answer: "No. It appears inside your existing cart drawer when a shopper adds an item. The Nobi team sets it up to match your cart." },
      { question: "Can shoppers ask questions there?", answer: "Yes. The cart assistant can answer a quick question, about shipping or a product, so a last-minute doubt doesn't become an abandoned cart." },
    ],
  },
  "ask-ai-filters": {
    seoTitle: "AI Filters | Nobi",
    seoDescription: "Shoppers describe what they want in plain words, and Nobi sets the filters on your collection or search page for them.",
    theme: "Teal",
    headline: "Describe it, and the filters set themselves",
    headlineMaxCh: 13,
    intro: "Shoppers type what they want, like “trail running shoes under $120, size 10”, and Nobi sets your page's own filters to match, right inside your collection page.",
    benefits: [
      { title: "No filter hunting", body: "Shoppers describe what they want in one line instead of clicking through five filter menus." },
      { title: "Uses your real filters", body: "Nobi sets the filters your page already has, so the results and layout stay exactly as you built them." },
      { title: "Fewer give-ups", body: "A shopper who would have bounced off a wall of facets gets to the right products in one step." },
    ],
    subFeatures: [
      { title: "Plain-language to filters", body: "“red, size medium, under $150” becomes the color, size and price facets your page already uses." },
      { title: "Lives in your filter panel", body: "A small “describe what you want” box drops into your collection page's existing filters." },
      { title: "Keeps your page's behavior", body: "Your grid, sort order and paging stay the same. Nobi only sets the filters; your page does the rest." },
    ],
    steps: [
      { title: "Add the box to your filters", body: "Drop the Nobi filter box into your collection page's filter panel with a small snippet." },
      { title: "A shopper describes what they want", body: "In plain words, the way they'd ask someone in your store." },
      { title: "Your filters update", body: "Nobi turns the request into your page's filters, and the results refresh." },
    ],
    worksFor: [
      { vertical: "Retail", body: "“linen, size 8, machine washable, under $100” ticks the right facets on your dresses page." },
      { vertical: "Auto dealers", body: "“SUV, under 40k miles, AWD, under $35k” narrows your inventory page in one line." },
    ],
    faq: [
      { question: "Does it replace my filters?", answer: "No. It sets the filters your collection page already has. Your grid, sort and paging all stay the same; Nobi just fills in the facets from what the shopper typed." },
      { question: "Is it hard to add?", answer: "No. It's a small web component you drop into your filter panel, with an optional hook if your filters are custom." },
    ],
  },
};
