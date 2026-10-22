/** Shared browser and prerendered metadata for the public company information page. */
export const AboutSeo = {
  path: "/about",
  title: "About Shop Nobi | Nobi",
  description: "Learn about Shop Nobi, the shopping search from Nobi, operated by Locusive, Inc. Find products across stores and buy directly from the retailer.",
  schema: [{
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Shop Nobi",
    url: "https://nobi.ai/about",
    about: { "@type": "Organization", name: "Nobi", legalName: "Locusive, Inc.", url: "https://nobi.ai" },
  }],
};
