// The page copy for the Search features. Every claim was checked against the Nobi code; check again before changing one.
// theme names a color in PanelTheme, and headlineMaxCh caps the headline's line length.

export const SEARCH_FEATURE_PAGES = {
  "ai-search": {
    seoTitle: "AI Search | Nobi",
    seoDescription: "Nobi's AI search understands what visitors mean, not only the words they type, so long, plain-language searches find the right products.",
    theme: "Violet",
    headline: "Search that knows what visitors mean",
    headlineMaxCh: 13,
    intro: "Visitors search the way they talk. Nobi reads the meaning behind every search, so “something red for a beach wedding” finds the right products instead of nothing.",
    steps: [
      { title: "Connect your catalog", body: "Nobi reads your products from Shopify, WooCommerce, a feed or a file, and keeps them up to date." },
      { title: "Visitors search in their own words", body: "Short searches get results right away. Questions go to the assistant, which answers them." },
      { title: "Results match the meaning", body: "Nobi understands colors, occasions, budgets and styles, even when they don't match your product names." },
    ],
    proof: { customer: "UNTUCKit", stat: "+17.1%", detail: "higher conversion rate in a two-month test against their previous search tool.", storyPath: "/customers/untuckit" },
  },
  "search-as-you-type": {
    seoTitle: "Search As You Type | Nobi",
    seoDescription: "Nobi suggests searches and shows matching products with pictures while visitors type, so they find what they want in fewer keystrokes.",
    theme: "Navy",
    headline: "Results before they finish typing",
    headlineMaxCh: 13,
    intro: "With every keystroke, Nobi suggests searches and shows matching products with pictures. Visitors see what you sell before they press enter.",
    steps: [
      { title: "A visitor starts typing", body: "Suggestions appear under the search bar after the first few letters." },
      { title: "Products show up with pictures", body: "Matching products appear beside the suggestions, with their picture and price." },
      { title: "One tap to the product", body: "Visitors go straight to a product, or press enter for the full results." },
    ],
  },
  "shopify-search-page": {
    seoTitle: "Shopify Search Results Page | Nobi",
    seoDescription: "Nobi can run your Shopify store's full search results page, with filters, a Filter with AI field, and results that match what shoppers mean.",
    theme: "Teal",
    headline: "Your whole search page, run by Nobi",
    headlineMaxCh: 12,
    intro: "Add Nobi's search results block to your Shopify theme and Nobi runs the full results page: products, filters, and a field where shoppers describe what they want.",
    steps: [
      { title: "Add the block to your theme", body: "Place the Nobi search results block on your Shopify search template, then match its colors and fonts." },
      { title: "Send header searches to it", body: "Turn on search page routing, and searches from your header land on the Nobi results page." },
      { title: "Shoppers search and filter", body: "They narrow results with your filters, or type what they want into Filter with AI." },
    ],
  },
  "site-answers": {
    seoTitle: "Answers From Your Site | Nobi",
    seoDescription: "Nobi reads your pages, policies and FAQs, then answers visitors' questions in plain words, with links to the pages the answer came from.",
    theme: "Navy",
    headline: "Answers from your own pages",
    headlineMaxCh: 12,
    intro: "When a visitor asks a question, Nobi answers in plain words from your pages, policies and FAQs, and shows the pages it used.",
    steps: [
      { title: "Add your pages", body: "Import pages or a whole sitemap into your knowledge base in the Nobi dashboard." },
      { title: "Visitors ask in the search bar", body: "Questions like “do you ship to Canada?” get an answer instead of a list of products." },
      { title: "Every answer shows its source", body: "Nobi links the pages it used, so visitors can read more and trust the answer." },
    ],
  },
  merchandising: {
    seoTitle: "Search Merchandising | Nobi",
    seoDescription: "Pin, boost, bury or hide products in Nobi search results, and send any search to the right page, without writing code.",
    theme: "Teal",
    headline: "Stay in control of every result",
    headlineMaxCh: 13,
    intro: "Nobi ranks results on its own, and you decide the exceptions. Pin your bestsellers, boost new arrivals, bury final sale items, and hide what's out of stock.",
    steps: [
      { title: "Choose what a rule applies to", body: "Pick the products, and the searches the rule should change." },
      { title: "Pick the action", body: "Hide, pin, boost or bury products, or send a search straight to a page you choose." },
      { title: "It goes live in search", body: "Rules apply to Nobi search results as soon as you save them. No code, no tickets." },
    ],
  },
  insights: {
    seoTitle: "Customer Insights | Nobi",
    seoDescription: "See what your customers search for, which products they click and buy, what is trending, and where your catalog has gaps.",
    theme: "Amber",
    headline: "Know what your customers want",
    headlineMaxCh: 13,
    intro: "Every search, click and purchase tells you something. Nobi turns them into a clear picture: what is trending, what converts, and what shoppers ask about.",
    steps: [
      { title: "Nobi records what shoppers do", body: "Every search, click, add to cart and order is tied back to what the shopper was looking for." },
      { title: "See the patterns", body: "Trending searches, the ones that convert best, and the topics shoppers ask about most." },
      { title: "Act on it", body: "Plan merchandising, stock and campaigns around what your customers actually want. UNTUCKit reviews it every week." },
    ],
  },
};
