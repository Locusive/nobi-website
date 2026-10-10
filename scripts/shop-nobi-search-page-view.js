// Turns the fetched page data into the page data the HTML is built from, keeping only safe
// values: slugs that are safe in file names, http or https links, and links without tracking tags.

const SlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CurrencyPattern = /^[A-Z]{3}$/;
const TrackingTagPrefix = "utm_";

/**
 * Returns whether a slug is safe to use in a file name and an address.
 *
 * @param {unknown} slug The slug to check.
 * @returns {boolean} True for lowercase letters and digits joined by single dashes.
 */
export function isSafeSlug(slug) {
  return typeof slug === "string" && SlugPattern.test(slug);
}

/**
 * Builds the page data for the first fetched pages with a safe slug and a title, up to the limit. The first
 * page wins a repeated slug. Links go only to pages within the limit; the rest show as plain text.
 *
 * @param {object[]} fetchedPages The fetched page objects, most searched first.
 * @param {number} pageLimit The most pages to build.
 * @returns {{pages: object[], leftOutCount: number}} The page data, and how many usable pages were left out.
 */
export function buildSearchPages(fetchedPages, pageLimit) {
  const pageBySlug = new Map();
  for (const page of fetchedPages.filter(isUsablePage)) {
    if (!pageBySlug.has(page.slug)) {
      pageBySlug.set(page.slug, page);
    }
  }

  const usablePages = [...pageBySlug.values()];
  const builtPages = usablePages.slice(0, Math.max(0, pageLimit));
  const links = {
    titleBySlug: new Map(usablePages.map((page) => [page.slug, page.title])),
    builtSlugs: new Set(builtPages.map((page) => page.slug)),
  };
  return {
    pages: builtPages.map((page) => buildSearchPage(page, links)),
    leftOutCount: usablePages.length - builtPages.length,
  };
}

/** Returns whether a fetched page can be built, and warns when it cannot. */
function isUsablePage(page) {
  if (isSafeSlug(page?.slug) && isText(page.title)) {
    return true;
  }
  console.warn(`prerender-shop: skipped a page with an unsafe slug or no title: ${JSON.stringify(page?.slug)}`);
  return false;
}

/** Builds the page data for one page. */
function buildSearchPage(page, links) {
  return {
    slug: page.slug,
    query: isText(page.query) ? page.query : page.title,
    title: page.title,
    refreshedAt: isText(page.refreshedAt) ? page.refreshedAt : null,
    breadcrumbs: buildBreadcrumbs(page, links.builtSlugs),
    related: buildRelatedPages(page, links),
    products: (Array.isArray(page.products) ? page.products : []).map(buildProduct).filter(Boolean),
  };
}

/** Keeps each category crumb, linking it only when it has a built page other than this one. */
function buildBreadcrumbs(page, builtSlugs) {
  const crumbs = Array.isArray(page.breadcrumbs) ? page.breadcrumbs : [];
  return crumbs
    .filter((crumb) => isText(crumb?.name))
    .map((crumb) => ({
      name: crumb.name,
      slug: crumb.slug !== page.slug && builtSlugs.has(crumb.slug) ? crumb.slug : null,
    }));
}

/** Keeps the related pages that are live, linking only the built ones. */
function buildRelatedPages(page, links) {
  const relatedSlugs = Array.isArray(page.relatedSlugs) ? page.relatedSlugs : [];
  return [...new Set(relatedSlugs)]
    .filter((slug) => slug !== page.slug && links.titleBySlug.has(slug))
    .map((slug) => ({ slug: links.builtSlugs.has(slug) ? slug : null, title: links.titleBySlug.get(slug) }));
}

/** Builds one product, or returns null when it has no name or no safe link. */
function buildProduct(product) {
  const url = readWebAddress(product?.url);
  if (!isText(product?.name) || !url) {
    return null;
  }

  return {
    name: product.name,
    brand: isText(product.brand) ? product.brand : null,
    storeName: isText(product.storeName) ? product.storeName : null,
    url: removeTrackingTags(url),
    imageUrl: readWebAddress(product.imageUrl)?.toString() ?? null,
    price: Number.isFinite(product.price) ? product.price : null,
    currency: CurrencyPattern.test(product.currency ?? "") ? product.currency : null,
    isInStock: product.isInStock === true,
  };
}

/** Returns the address when it is a valid http or https address, else null. */
function readWebAddress(value) {
  if (!isText(value)) {
    return null;
  }

  try {
    const address = new URL(value);
    return address.protocol === "http:" || address.protocol === "https:" ? address : null;
  } catch {
    return null;
  }
}

/** Removes utm_ tags so a store never sees our links as a campaign. */
function removeTrackingTags(address) {
  const trackingTags = [...address.searchParams.keys()].filter((key) => key.startsWith(TrackingTagPrefix));
  trackingTags.forEach((key) => address.searchParams.delete(key));
  return address.toString();
}

/** Returns whether a value is a string with visible text. */
function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
