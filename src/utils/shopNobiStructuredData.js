// Builds the schema.org structured data the prebuilt Shop Nobi pages carry in their head.

import { BaseUrl } from "./shopNobiPage.js";

const InStock = "https://schema.org/InStock";
const OutOfStock = "https://schema.org/OutOfStock";

/**
 * Builds the ItemList of Product structured data for a search page's products.
 *
 * @param {object} page The search page data.
 * @param {string} pageUrl The page's address.
 * @returns {object} The ItemList.
 */
export function buildProductListSchema(page, pageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title,
    url: pageUrl,
    itemListElement: page.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: buildProductSchema(product),
    })),
  };
}

/**
 * Builds the BreadcrumbList structured data: Shop Nobi first, then the given crumbs in order.
 *
 * @param {{name: string, url: string}[]} crumbs The crumbs after Shop Nobi, ending with the page itself.
 * @returns {object} The BreadcrumbList.
 */
export function buildBreadcrumbSchema(crumbs) {
  const allCrumbs = [{ name: "Shop Nobi", url: `${BaseUrl}/shop` }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Builds the FAQPage structured data for a page's questions and answers.
 *
 * @param {{question: string, answer: string}[]} faq The questions and answers.
 * @returns {object} The FAQPage.
 */
export function buildFaqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/** Builds the Product structured data for one product, leaving out fields it does not have. */
function buildProductSchema(product) {
  const schema = { "@type": "Product", name: product.name, url: product.url };
  if (product.imageUrl) {
    schema.image = product.imageUrl;
  }
  if (product.brand) {
    schema.brand = { "@type": "Brand", name: product.brand };
  }
  if (typeof product.price === "number" && product.currency) {
    schema.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.isInStock ? InStock : OutOfStock,
      url: product.url,
    };
  }
  return schema;
}
