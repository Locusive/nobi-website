// The head values for the customer story pages. The pages and scripts/prerender-pages.js both read them from here,
// so the tags a crawler reads match the ones the page sets once React mounts.

const BaseUrl = "https://nobi.ai";
const Publisher = Object.freeze({ "@type": "Organization", name: "Nobi", url: BaseUrl });

/** Builds one case study's head values and its Article schema. */
function caseStudy({ path, title, description }) {
  return {
    path,
    title,
    description,
    schema: [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url: `${BaseUrl}${path}`,
      publisher: Publisher,
    }],
  };
}

/** The index that lists every story. */
export const CustomerStoriesSeo = Object.freeze({
  path: "/customers",
  title: "Customer Stories | Nobi",
  description: "See how Lucchese, UNTUCKit, and Kilte use Nobi's AI search to generate measurable revenue lift. Real results from real brands.",
  schema: [{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Customer Stories",
    url: `${BaseUrl}/customers`,
    publisher: Publisher,
  }],
});

export const UntuckitStorySeo = Object.freeze(caseStudy({
  path: "/customers/untuckit",
  title: "UNTUCKit + Nobi: +21.3% Revenue Per Searcher | Case Study",
  description: "A two-month pilot. A clear result. UNTUCKit saw +17.1% conversion rate lift and +21.3% revenue per searcher, then went all in on Nobi.",
}));

export const LuccheseStorySeo = Object.freeze(caseStudy({
  path: "/customers/lucchese",
  title: "Lucchese Generated $1M+ With Nobi AI Search | Case Study",
  description: "$1M+ incremental revenue, 33x ROI, +22.9% checkout completion. How Lucchese transformed search with Nobi and kept expanding from there.",
}));

export const KilteStorySeo = Object.freeze(caseStudy({
  path: "/customers/kilte",
  title: "Kilte + Nobi: 21.7% More Conversions | Case Study",
  description: "Kilte uses evocative color names like Cappuccino and Ivory. Nobi maps them to what shoppers actually search for. Result: 21.7% more conversions.",
}));

/** Every customer story page, index first. */
export const CUSTOMER_STORY_PAGES = Object.freeze([
  CustomerStoriesSeo,
  UntuckitStorySeo,
  LuccheseStorySeo,
  KilteStorySeo,
]);
