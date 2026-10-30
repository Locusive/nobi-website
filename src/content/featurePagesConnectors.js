// Page copy for the AI connectors feature. Every claim was checked against the Nobi code and against a live
// merchant server; check again before changing one. theme names a color in PanelTheme.

export const CONNECTOR_FEATURE_PAGES = {
  "ai-connectors": {
    seoTitle: "ChatGPT and Claude Connectors | Nobi",
    seoDescription: "Nobi puts your store inside ChatGPT and Claude, listed under your own name, answering from your own catalog and your own support pages.",
    theme: "Navy",
    headline: "Your store, inside ChatGPT and Claude",
    headlineMaxCh: 16,
    intro: "People are asking ChatGPT and Claude what to buy. Nobi gives your store a connector in each of them, listed under your own name, so those shoppers find your products and get your answers instead of someone else's.",
    benefits: [
      { title: "Listed under your name", body: "Nobi submits your connector to the ChatGPT and Claude directories as your store, not as Nobi. Shoppers see your name, your description and your logo." },
      { title: "Answers for your store only", body: "Your connector searches your catalog and reads your own support pages. It never answers for another store, and never sends a shopper somewhere else." },
      { title: "You see what it brings", body: "Searches and clicks are reported back to you, split by assistant, so you can tell ChatGPT traffic from Claude traffic." },
    ],
    subFeatures: [
      { title: "Search, compare and check stock", body: "Assistants can search your catalog, open a product in full, compare two products, check price and availability, and find alternatives when something is out of stock." },
      { title: "Answers from your own pages", body: "Shipping, returns, sizing and care questions are answered from the pages and documents you have already given Nobi, with the source." },
      { title: "A hostname of your own", body: "Your connector can answer on a hostname of your own, such as mcp.yourstore.com. You add one DNS record and Nobi handles the rest, including the certificate." },
      { title: "You choose the tools", body: "Everything your store can serve is on to begin with. Turn any of it off from your dashboard whenever you want." },
    ],
    steps: [
      { title: "Nobi lists your store", body: "We prepare your connector and submit it to the ChatGPT and Claude directories under your own name. You do not have to build anything." },
      { title: "Shoppers ask about what you sell", body: "Someone asks about boots, or sizing, or shipping. The assistant asks your connector and answers from your catalog and your pages." },
      { title: "They come to you to buy", body: "Every product links to your site. The sale happens on your store, and you see where it came from." },
    ],
    worksFor: [
      { vertical: "Retail", body: "Someone asks ChatGPT for ostrich boots in a size 10 and gets yours, with the price, whether it is in stock, and a link to your product page." },
      { vertical: "Auto dealers", body: "A buyer asks Claude what is on the lot in their budget, and gets your inventory rather than a listing site's." },
    ],
    faq: [
      { question: "Do I have to build anything?", answer: "No. Your connector already exists and already works. Nobi prepares the listing and submits it to each directory for you. The only optional step is a DNS record, if you want the connector on a hostname of your own." },
      { question: "What is an MCP server?", answer: "It is the piece that lets an assistant talk to your store. Every connector needs one and Nobi runs yours. You deal with the connector; the server is ours to look after." },
      { question: "Will it answer for other stores?", answer: "No. Your connector is scoped to your catalog and your documents. It has no way to reach another store's products." },
      { question: "Can I turn parts of it off?", answer: "Yes. Every tool your store can serve starts on, and you can turn any of them off from your dashboard. A tool your store cannot serve is never offered at all." },
      { question: "How do I know it is working?", answer: "Your dashboard reports the searches your connector handled, split by assistant, so you can see ChatGPT and Claude separately." },
    ],
  },
};
