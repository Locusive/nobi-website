// A Shop Nobi search page is a prebuilt page for one search at /shop/s/<slug>. The build and the
// browser both use these helpers, so the page looks and is described the same way in each.

const BaseUrl = "https://nobi.ai";
const ShopNobiPath = "/shop";
const SearchPagePathPrefix = "/shop/s/";
const ShopNobiImage = `${BaseUrl}/shop-nobi-og-image.png`;
const InStock = "https://schema.org/InStock";
const OutOfStock = "https://schema.org/OutOfStock";

/** The id of the script element that holds the embedded page data. */
export const SearchPageDataElementId = "shop-nobi-search-page";

/**
 * Returns the path of a search page.
 *
 * @param {string} slug The page's slug, such as "black-leather-boots".
 * @returns {string} The path, such as "/shop/s/black-leather-boots".
 */
export function searchPagePath(slug) {
  return `${SearchPagePathPrefix}${slug}`;
}

/**
 * Returns the full address of a search page.
 *
 * @param {string} slug The page's slug.
 * @returns {string} The page's address on nobi.ai.
 */
export function searchPageUrl(slug) {
  return `${BaseUrl}${searchPagePath(slug)}`;
}

/**
 * Returns the page description. It never mentions how many stores we cover, paid stores or ranking.
 *
 * @param {string} title The page title, such as "Black Leather Boots".
 * @returns {string} The meta description.
 */
export function describeSearchPage(title) {
  return `${title} from the best stores online, in one search. Shop Nobi is a search engine: you buy directly from the store.`;
}

/**
 * Builds the values useSEO and the build both write into the page head.
 *
 * @param {object} page The search page data.
 * @returns {{title: string, description: string, path: string, image: string, schema: object[]}} The head values.
 */
export function buildSearchPageSeo(page) {
  return {
    title: `${page.title} | Shop Nobi`,
    description: describeSearchPage(page.title),
    path: searchPagePath(page.slug),
    image: ShopNobiImage,
    schema: [buildProductListSchema(page), buildBreadcrumbSchema(page)],
  };
}

/**
 * Reads the page data the build embedded, when the browser is on that page.
 *
 * @param {string} pathname The current path.
 * @returns {object | null} The page data, or null on any other page.
 */
export function readEmbeddedSearchPage(pathname) {
  if (typeof document === "undefined" || !pathname.startsWith(SearchPagePathPrefix)) {
    return null;
  }

  const element = document.getElementById(SearchPageDataElementId);
  if (!element) {
    return null;
  }

  const page = JSON.parse(element.textContent);
  const currentPath = pathname.replace(/\/+$/, "");
  return searchPagePath(page.slug) === currentPath ? page : null;
}

/**
 * Formats a price for display, such as "$495.00".
 *
 * @param {number | null} price The price.
 * @param {string | null} currency The three-letter currency code.
 * @returns {string} The formatted price, or an empty string when there is no price.
 */
export function formatPrice(price, currency) {
  if (typeof price !== "number") {
    return "";
  }
  if (!currency) {
    return price.toFixed(2);
  }

  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

/** Builds the ItemList of Product structured data for the page's products. */
function buildProductListSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.title,
    url: searchPageUrl(page.slug),
    itemListElement: page.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: buildProductSchema(product),
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

/** Builds the BreadcrumbList structured data: Shop Nobi, each linked category, then this page. */
function buildBreadcrumbSchema(page) {
  const crumbs = [
    { name: "Shop Nobi", url: `${BaseUrl}${ShopNobiPath}` },
    ...page.breadcrumbs.filter((crumb) => crumb.slug).map((crumb) => ({ name: crumb.name, url: searchPageUrl(crumb.slug) })),
    { name: page.title, url: searchPageUrl(page.slug) },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
