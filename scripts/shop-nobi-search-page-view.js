// Turns the fetched page data into the page data the HTML is built from, keeping only safe values: safe slugs,
// http or https links, and plain links without tracking tags. Paid store links are kept only in base64.

import { removeTrackingTags } from "../src/utils/shopNobiPage.js";
import { encodePaidLink } from "../src/utils/shopNobiPaidLink.js";
import { readProductPlacement } from "../src/utils/shopNobiProductPlacement.js";

const SlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CurrencyPattern = /^[A-Z]{3}$/;
const IdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UpdatedDateFormat = { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };
// Current CUCKOO terms allow only Awin-provided imagery; no matching blender creative was available.
const CuckooMerchantId = "962fb5d1-9238-4ecf-bc36-0ddc304be721";
const CuckooCommissionNotice = "Disclosure: Compensated Affiliate.";
// ESR product material and price authority is unresolved; hold its records only in prebuilt publication.
const EsrMerchantId = "e43e55da-830c-4dc3-82f5-c8995273b2b2";
// Selected retailer options were verified as blue/red rather than green; this is not a color classifier.
const GreenRefillMembershipRevision = "2026-10-29T06:57:18Z";
const GreenRefillMembershipHolds = [
  {
    "productVariantId": "8b2ff94f-ea24-4a49-b100-316a962ffa67",
    "owningMerchantId": "6f5d6fee-60e6-4def-a76e-6a7b5a3ab936",
    "url": "https://yosekastationery.com/products/blen-multi-pen-refill?variant=44109079970005"
  },
  {
    "productVariantId": "295b9d3e-5b76-4562-805b-bd579a799e71",
    "owningMerchantId": "6f5d6fee-60e6-4def-a76e-6a7b5a3ab936",
    "url": "https://yosekastationery.com/products/anterique-stationers-gp1-gel-pen-refill-0-5mm?variant=53088642891989"
  },
  {
    "productVariantId": "a2f15394-eb68-4a27-a99e-82efd187070a",
    "owningMerchantId": "5aa170d5-12f1-4bbd-8926-33d5ea684392",
    "url": "https://camdenrose.com/products/greenfield-pen-ink-cartridges?variant=46756494016744"
  }
];

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
 * Returns whether a value is a string with visible text.
 *
 * @param {unknown} value The value to check.
 * @returns {boolean} True for a string that is not blank.
 */
export function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Keeps the fetched pages with a safe slug and a title, in order. The first page wins a repeated slug.
 *
 * @param {object[]} fetchedPages The fetched page objects, most searched first.
 * @returns {object[]} The usable pages.
 */
export function selectUsablePages(fetchedPages) {
  const pageBySlug = new Map();
  for (const page of fetchedPages.filter(isUsablePage)) {
    if (!pageBySlug.has(page.slug)) {
      pageBySlug.set(page.slug, page);
    }
  }
  return [...pageBySlug.values()];
}

/**
 * Builds the page data for the first usable pages, up to the limit. Related searches outside the limit
 * retain their query so the browser can open a search without linking to an unbuilt page.
 *
 * @param {object[]} usablePages The usable pages, most searched first.
 * @param {number} pageLimit The most pages to build.
 * @returns {{pages: object[], leftOutCount: number}} The page data, and how many usable pages were left out.
 */
export function buildSearchPages(usablePages, pageLimit) {
  const builtPages = usablePages.slice(0, Math.max(0, pageLimit));
  const links = {
    pageBySlug: new Map(usablePages.map((page) => [page.slug, page])),
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
  const sourceProducts = Array.isArray(page.products) ? page.products : [];
  const matchedProducts = sourceProducts.filter(product => !isHeldGreenRefill(page.slug, product));
  const products = matchedProducts.map(buildProduct).filter(Boolean);
  return {
    slug: page.slug,
    query: isText(page.query) ? page.query : page.title,
    title: page.title,
    description: isText(page.description) ? page.description.trim() : null,
    categoryPath: isText(page.categoryPath) ? page.categoryPath.trim() : null,
    refreshedAt: isText(page.refreshedAt) ? page.refreshedAt : null,
    updatedDate: formatUpdatedDate(page.refreshedAt),
    guide: (Array.isArray(page.guide) ? page.guide : []).filter(isText),
    faq: buildFaq(page),
    breadcrumbs: buildBreadcrumbs(page, links.builtSlugs),
    related: buildRelatedPages(page, links),
    products,
    ...(matchedProducts.length !== sourceProducts.length
      ? { publicationMembershipRevisedAt: GreenRefillMembershipRevision } : {}),
    ...(page.publicationFilteredProducts === true || products.length !== sourceProducts.length
      ? { publicationFilteredProducts: true } : {}),
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

/** Keeps known related searches, preserving their query and linking only to existing built pages. */
function buildRelatedPages(page, links) {
  const relatedSlugs = Array.isArray(page.relatedSlugs) ? page.relatedSlugs : [];
  return [...new Set(relatedSlugs)]
    .filter((slug) => slug !== page.slug && links.pageBySlug.has(slug))
    .map((slug) => {
      const related = links.pageBySlug.get(slug);
      return {
        slug: links.builtSlugs.has(slug) ? slug : null,
        title: related.title,
        query: isText(related.query) ? related.query.trim() : related.title.trim(),
      };
    });
}

/** Holds only the reviewed page membership while preserving the same variant on other pages. */
function isHeldGreenRefill(slug, product) {
  return slug === "green-pen-ink-refills" && GreenRefillMembershipHolds.some(held =>
    held.productVariantId === product?.productVariantId
    && held.owningMerchantId === product?.owningMerchantId
    && held.url === product?.url);
}

/** Builds a safe prebuilt card, holding ESR and keeping CUCKOO text-only. */
function buildProduct(product) {
  const merchantId = typeof product?.owningMerchantId === "string" ? product.owningMerchantId.toLowerCase() : null;
  if (merchantId === EsrMerchantId) {
    return null;
  }
  const url = readWebAddress(product?.url);
  const imageAddress = readWebAddress(product?.imageUrl);
  const isCuckoo = merchantId === CuckooMerchantId;
  if (!isText(product?.name) || !url || (!isCuckoo && !imageAddress)) {
    return null;
  }

  return {
    name: product.name,
    brand: isText(product.brand) ? product.brand : null,
    storeName: isText(product.storeName) ? product.storeName : null,
    url: removeTrackingTags(url),
    imageUrl: isCuckoo ? null : imageAddress.toString(),
    ...(isCuckoo ? { commissionNotice: CuckooCommissionNotice } : {}),
    price: Number.isFinite(product.price) ? product.price : null,
    currency: CurrencyPattern.test(product.currency ?? "") ? product.currency : null,
    isInStock: product.isInStock === true,
    ...readPaidLinks(product),
    ...(typeof product.storyPaidLink === "boolean" ? { storyPaidLink: product.storyPaidLink } : {}),
    ...readProductPlacement(product),
    ...readProductIds(product),
  };
}

/**
 * Keeps the product's variant id and its store's id when the API sent both, so the page can record which products it
 * showed and its clicks can name the product and store. Pages built before the API sent them carry neither.
 */
function readProductIds(product) {
  if (!IdPattern.test(product.productVariantId ?? "") || !IdPattern.test(product.owningMerchantId ?? "")) {
    return {};
  }
  return { productVariantId: product.productVariantId, owningMerchantId: product.owningMerchantId };
}

/**
 * Keeps the API's finished store link only for a paid product with a safe link, in base64 so crawlers do not follow
 * it. Any other product carries no extra link. Web Stories need none: their link route adds the paid link itself.
 */
function readPaidLinks(product) {
  if (product.paidLink !== true || readWebAddress(product.storeLink) === null) {
    return { paidLink: false };
  }
  return { paidLink: true, encodedStoreLink: encodePaidLink(product.storeLink) };
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

/** Keeps the questions that have both a question and an answer. */
function buildFaq(page) {
  const entries = Array.isArray(page.faq) ? page.faq : [];
  return entries
    .filter((entry) => isText(entry?.question) && isText(entry.answer))
    .map((entry) => ({ question: entry.question, answer: entry.answer }));
}

/** Formats when the page was refreshed, such as "October 11, 2026", or returns null when it is not a date. */
function formatUpdatedDate(refreshedAt) {
  const refreshed = new Date(refreshedAt);
  return isText(refreshedAt) && !Number.isNaN(refreshed.getTime()) ? refreshed.toLocaleDateString("en-US", UpdatedDateFormat) : null;
}
