// Page copy for the Search group features. Every claim was checked against the Nobi code; check again before changing one.
// theme names a color in PanelTheme. benefits is the "why it helps" story; worksFor shows it across industries.

export const SEARCH_FEATURE_PAGES = {
  "ai-search": {
    seoTitle: "AI Search | Nobi",
    seoDescription: "Nobi's AI search understands what visitors mean, not only the words they type, so long, plain-language searches find the right results.",
    theme: "Violet",
    headline: "Search that knows what people mean",
    headlineMaxCh: 13,
    intro: "People search the way they talk. Nobi reads the meaning behind every search, so “something red for a beach wedding” or “family SUV with good gas mileage” finds the right results instead of nothing.",
    benefits: [
      { title: "No more dead ends", body: "Keyword search returns nothing when the words don't match. Nobi understands the intent, so shoppers keep going instead of leaving." },
      { title: "Fewer lost sales", body: "Every search that ends in results is a shopper who can still buy. Relevant results lift conversion from the first visit." },
      { title: "No tuning treadmill", body: "Nobi ranks on meaning out of the box. You don't write a synonym or a rule for every way people phrase things." },
    ],
    steps: [
      { title: "Connect your catalog", body: "Nobi reads your products from Shopify, WooCommerce, a feed or a file, and keeps them up to date." },
      { title: "People search in their own words", body: "Short searches get results right away. Questions get an answer, with the products and pages behind it." },
      { title: "Results match the meaning", body: "Nobi understands colors, occasions, budgets, trims and styles, even when they don't match your product names." },
    ],
    worksFor: [
      { vertical: "Retail", body: "“waterproof hiking boots for wide feet” brings back the right boots, not everything with “boot” in the title." },
      { vertical: "Auto dealers", body: "“low mileage truck under $30k” finds the right vehicles on your lot, the way a shopper would ask a salesperson." },
    ],
    proof: { customer: "UNTUCKit", stat: "+17.1%", detail: "higher conversion rate in a two-month test against their previous search tool.", storyPath: "/customers/untuckit" },
  },
  "search-as-you-type": {
    seoTitle: "Typeahead Search | Nobi",
    seoDescription: "Nobi suggests searches and shows matching products with pictures while people type, so they find what they want in fewer keystrokes.",
    theme: "Navy",
    headline: "Results before they finish typing",
    headlineMaxCh: 13,
    intro: "With every keystroke, Nobi suggests searches and shows matching results with pictures. People see what you have before they press enter.",
    benefits: [
      { title: "Shorter path to the product", body: "A shopper taps a suggestion and lands on the right product. No results page, no second search." },
      { title: "Guides vague searches", body: "Suggestions nudge a broad search toward the terms that actually have results." },
      { title: "Shows you have it", body: "Thumbnails in the dropdown prove the catalog has what the shopper came for." },
    ],
    steps: [
      { title: "Someone starts typing", body: "Suggestions appear under the search bar after the first few letters." },
      { title: "Products show up with pictures", body: "Matching products appear beside the suggestions, with their picture and price." },
      { title: "One tap to the result", body: "They go straight to a product, or press enter for the full results." },
    ],
    worksFor: [
      { vertical: "Retail", body: "Typing “lin” suggests “linen dress” and shows three linen dresses before the shopper finishes the word." },
      { vertical: "Auto dealers", body: "Typing “sil” suggests “Silverado” and shows the trucks in stock, with trim and price." },
    ],
  },
  "smart-answers": {
    seoTitle: "Smart Answers | Nobi",
    seoDescription: "One search, one screen: Nobi shows a plain-language AI answer alongside the products and the pages it came from.",
    theme: "Magenta",
    headline: "An answer, products and pages in one",
    headlineMaxCh: 13,
    intro: "When someone asks a question, Nobi answers it in plain words and shows the products and the pages behind the answer, all on one screen. It's search and answers together, instead of a list of links.",
    benefits: [
      { title: "Answers, not a link list", body: "Shoppers get the answer itself, in plain language, instead of ten blue links to dig through." },
      { title: "Every answer is grounded", body: "Nobi answers only from your pages, products and policies, and shows the sources, so shoppers can trust it." },
      { title: "Discovery and support in one", body: "A question like “what's good for a rainy hike?” returns an answer and the products that fit it." },
    ],
    steps: [
      { title: "Add your pages", body: "Import pages or a whole sitemap into your knowledge base in the Nobi dashboard." },
      { title: "Someone asks a question", body: "In the search bar, in their own words, the way they'd ask a person." },
      { title: "Nobi answers, with the receipts", body: "A plain answer, the products that match, and the pages it came from, all together." },
    ],
    worksFor: [
      { vertical: "Retail", body: "“Do you ship to Canada?” returns the answer plus your shipping and returns pages." },
      { vertical: "Auto dealers", body: "“Do you offer financing for first-time buyers?” returns the answer and your financing page." },
    ],
  },
  merchandising: {
    seoTitle: "Search Merchandising | Nobi",
    seoDescription: "Pin, boost, bury or hide products in Nobi search results, and send any search to the right page, without writing code.",
    theme: "Teal",
    headline: "Stay in control of every result",
    headlineMaxCh: 13,
    intro: "Nobi ranks results on its own, and you decide the exceptions. Pin your bestsellers, boost new arrivals, bury final sale items, and hide what's out of stock.",
    benefits: [
      { title: "Promote on purpose", body: "Push the margin you care about or the launch you're running to the top of the right searches." },
      { title: "Hide what hurts", body: "Keep out-of-stock and discontinued items out of results, so shoppers never hit a dead product." },
      { title: "No engineering tickets", body: "Merchandisers make the change in the dashboard, and it's live in search in seconds." },
    ],
    steps: [
      { title: "Choose what a rule applies to", body: "Pick the products, and the searches the rule should change." },
      { title: "Pick the action", body: "Hide, pin, boost or bury products, or send a search straight to a page you choose." },
      { title: "It goes live in search", body: "Rules apply to Nobi search results as soon as you save them. No code, no tickets." },
    ],
    worksFor: [
      { vertical: "Retail", body: "Pin the new season's collection to the top of “dresses” for launch week." },
      { vertical: "Auto dealers", body: "Boost the models you're running incentives on to the top of their searches." },
    ],
  },
  insights: {
    seoTitle: "Customer Insights | Nobi",
    seoDescription: "See what your customers search for, which products they click and buy, what is trending, and what they ask about.",
    theme: "Amber",
    headline: "Know what your customers want",
    headlineMaxCh: 13,
    intro: "Every search, click and purchase tells you something. Nobi turns them into a clear picture: what is trending, what converts, and what shoppers ask about.",
    benefits: [
      { title: "Plan from real demand", body: "Stock and promote what customers are actually searching for, not what you guess they want." },
      { title: "Catch trends early", body: "See a search rising week over week before it shows up in your sales numbers." },
      { title: "Fix the gaps", body: "When shoppers ask about the same thing again and again, you know what content or products to add." },
    ],
    steps: [
      { title: "Nobi records what shoppers do", body: "Every search, click, add to cart and order is tied back to what the shopper was looking for." },
      { title: "See the patterns", body: "Trending searches, the ones that convert best, and the topics shoppers ask about most." },
      { title: "Act on it", body: "Plan merchandising, stock and campaigns around what your customers actually want. UNTUCKit reviews it every week." },
    ],
    worksFor: [
      { vertical: "Retail", body: "A spike in “wedding guest” searches tells the buying team where next month's demand is going." },
      { vertical: "Auto dealers", body: "A rise in “hybrid” searches tells the lot which models to stock and feature." },
    ],
  },
};
